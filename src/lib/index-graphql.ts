import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { graphql } from "@mysten/sui/graphql/schemas/latest";
import { prisma } from "./prisma";
import { calculateAndCacheStats } from "./stats";

const gqlClient = new SuiGraphQLClient({
  url: "https://graphql.mainnet.sui.io/graphql",
});

const HISTORY_QUERY = graphql(`
  query GetUserHistory($address: SuiAddress!, $cursor: String) {
    address(address: $address) {
      transactions(first: 50, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          digest
          sender {
            address
          }
          effects {
            checkpoint {
              timestamp
            }
            balanceChanges {
              nodes {
                coinType {
                  repr
                }
                amount
                owner {
                  address
                }
              }
            }
          }
        }
      }
    }
  }
`);

export async function indexUser(inputAddress: string) {
  const address = normalizeSuiAddress(inputAddress);
  console.log(`[Indexer] Starting for ${address}...`);

  let hasNextPage = true;
  let cursor: string | null = null;
  let totalIndexed = 0;

  await prisma.user.upsert({
    where: { address },
    update: { isIndexed: false },
    create: { address, isIndexed: false },
  });

  try {
    while (hasNextPage) {
      const result = await gqlClient.query({
        query: HISTORY_QUERY,
        variables: { address, cursor },
      });

      if (result.errors) {
        console.error("[Indexer] Schema Warning:", result.errors[0].message);
      }

      const data = result.data as any;
      const txs = data?.address?.transactions?.nodes || [];

      if (!data?.address) {
        console.log(`[Indexer] Address not found on chain.`);
        break;
      }

      if (txs.length === 0) {
        if (totalIndexed === 0) console.log(`[Indexer] No transactions found.`);
        break;
      }

      const dbTransactions = txs.map((tx: any) => {
        let timestamp = new Date();
        if (tx.effects?.checkpoint?.timestamp) {
          timestamp = new Date(tx.effects.checkpoint.timestamp);
        }

        const rawBalanceChanges = tx.effects?.balanceChanges?.nodes || [];

        const cleanBalanceChanges = rawBalanceChanges.map((change: any) => ({
          amount: change.amount,
          coinType: change.coinType?.repr || "Unknown",
          owner: change.owner?.address || "",
        }));

        const interactors = extractInteractors(tx, address, rawBalanceChanges);

        return {
          digest: tx.digest,
          timestamp: timestamp,
          sender: tx.sender?.address || "",
          userAddress: address,
          interactedWith: interactors,
          balanceChanges: cleanBalanceChanges,
        };
      });

      await prisma.transaction.createMany({
        data: dbTransactions,
        skipDuplicates: true,
      });

      totalIndexed += dbTransactions.length;
      console.log(`[Indexer] Indexed ${totalIndexed} txs...`);

      const pageInfo = data?.address?.transactions?.pageInfo;
      hasNextPage = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor || null;

      if (totalIndexed >= 200) break;
    }

    console.log(`[Indexer] Calculating stats...`);
    await calculateAndCacheStats(address);
    console.log(`[Indexer] DONE.`);
  } catch (error) {
    console.error("[Indexer] FAILED:", error);
  }
}

// --- Helpers ---

function normalizeSuiAddress(addr: string): string {
  if (!addr) return "";
  let clean = addr.startsWith("0x") ? addr.slice(2) : addr;
  clean = clean.padStart(64, "0");
  return "0x" + clean.toLowerCase();
}

function extractInteractors(
  tx: any,
  userAddress: string,
  balanceChanges: any[]
): string[] {
  const interactors = new Set<string>();
  const sender = tx.sender?.address;
  const normalizedUser = normalizeSuiAddress(userAddress);

  if (sender && normalizeSuiAddress(sender) !== normalizedUser) {
    interactors.add(sender);
  }

  if (sender && normalizeSuiAddress(sender) === normalizedUser) {
    balanceChanges.forEach((change: any) => {
      const recipient = change.owner?.address;
      if (recipient) {
        const normRecipient = normalizeSuiAddress(recipient);
        if (normRecipient !== normalizedUser && BigInt(change.amount) > 0) {
          interactors.add(recipient);
        }
      }
    });
  }

  return Array.from(interactors);
}
