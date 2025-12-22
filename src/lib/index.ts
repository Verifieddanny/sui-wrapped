import { prisma } from './prisma'
import type { PaginatedTransactionResponse } from '@mysten/sui/client'
import { createSuiClientWithRateLimitHandling } from './rpc-switcher'
import { calculateAndCacheStats } from './stats'

const client = createSuiClientWithRateLimitHandling() as any

export async function indexUser(inputAddress: string) {
  const address = normalizeSuiAddress(inputAddress)
  console.log(`[Indexer] Starting for ${address}...`)

  let hasNextPage = true
  let cursor: string | null = null
  let totalIndexed = 0

  await prisma.user.upsert({
    where: { address },
    update: { isIndexed: false },
    create: { address, isIndexed: false },
  })

  try {
    while (hasNextPage) {
      const response: PaginatedTransactionResponse =
        await client.queryTransactionBlocks({
          filter: {
            ToAddress: address,
          },
          options: {
            showEffects: true,
            showBalanceChanges: true,
            showObjectChanges: false,
            showInput: true,
          },
          cursor: cursor,
          limit: 50,
        })

      const txs = response.data
      if (txs.length === 0) break

      const dbTransactions = txs.map((tx: any) => {
        const timestamp = tx.timestampMs
          ? new Date(parseInt(tx.timestampMs))
          : new Date()

        const rawBalanceChanges = tx.balanceChanges || []

        const cleanBalanceChanges = rawBalanceChanges.map((change: any) => ({
          amount: change.amount,
          coinType: change.coinType || 'Unknown',
          owner: change.owner?.AddressOwner || '',
        }))

        const interactors = extractInteractors(tx, address, rawBalanceChanges)

        return {
          digest: tx.digest,
          timestamp: timestamp,
          sender: tx.transaction?.data?.sender || '',
          userAddress: address,
          interactedWith: interactors,
          balanceChanges: cleanBalanceChanges,
        }
      })

      await prisma.transaction.createMany({
        data: dbTransactions,
        skipDuplicates: true,
      })

      totalIndexed += dbTransactions.length
      console.log(
        `[Indexer] Indexed ${totalIndexed} txs (Current RPC: ${client.getCurrentClient().config.url})`,
      )

      // Update pagination
      hasNextPage = response.hasNextPage
      cursor = response.nextCursor ?? null
    }

    console.log(`[Indexer] Calculating stats...`)
    await calculateAndCacheStats(address)

    await prisma.user.update({
      where: { address },
      data: { isIndexed: true },
    })
  } catch (error) {
    console.error('[Indexer] FAILED:', error)
  }
}

// --- Helpers ---

function normalizeSuiAddress(addr: string): string {
  if (!addr) return ''
  let clean = addr.startsWith('0x') ? addr.slice(2) : addr
  clean = clean.padStart(64, '0')
  return '0x' + clean.toLowerCase()
}

function extractInteractors(
  tx: any,
  userAddress: string,
  balanceChanges: any[],
): string[] {
  const interactors = new Set<string>()
  const sender = tx.sender?.address
  const normalizedUser = normalizeSuiAddress(userAddress)

  if (sender && normalizeSuiAddress(sender) !== normalizedUser) {
    interactors.add(sender)
  }

  if (sender && normalizeSuiAddress(sender) === normalizedUser) {
    balanceChanges.forEach((change: any) => {
      const recipient = change.owner?.address
      if (recipient) {
        const normRecipient = normalizeSuiAddress(recipient)
        if (normRecipient !== normalizedUser && BigInt(change.amount) > 0) {
          interactors.add(recipient)
        }
      }
    })
  }

  return Array.from(interactors)
}
