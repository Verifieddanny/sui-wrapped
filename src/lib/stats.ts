import { prisma } from "./prisma";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Archetype Config
const ARCHETYPES = {
  WHALE: { name: "Sui Whale", emoji: "🐋", desc: "You move markets." },
  DEGEN: { name: "Sui Degen", emoji: "🎰", desc: "High frequency, high risk." },
  BANKER: {
    name: "Sui Banker",
    emoji: "🏦",
    desc: "Strategic inflows, steady growth.",
  },
  NORMIE: { name: "Sui Normie", emoji: "🙂", desc: "Just passing through." },
  GHOST: { name: "Ghost Chain", emoji: "👻", desc: "Barely here." },
};

export async function calculateAndCacheStats(address: string) {
  // 1. Peak Activity Day
  const peakDayResult: any[] = await prisma.$queryRaw`
    SELECT DATE(timestamp) as day, COUNT(*)::int as count
    FROM "Transaction"
    WHERE "userAddress" = ${address}
    GROUP BY day
    ORDER BY count DESC
    LIMIT 1
  `;

  // 2. Fetch all Txs
  const txs = await prisma.transaction.findMany({
    where: { userAddress: address },
    orderBy: { timestamp: "desc" },
    select: {
      balanceChanges: true,
      digest: true,
      interactedWith: true,
      timestamp: true,
      sender: true,
    },
  });

  let totalVolume = 0;
  let inflow = 0;
  let outflow = 0;
  let biggestTxAmount = 0;
  let biggestTxHash = "";

  const assetMap = new Map<string, number>();
  const interactionMap = new Map<string, number>();
  const activityMap = new Map<string, number>();

  monthNames.forEach((m) => activityMap.set(m, 0));

  txs.forEach((tx) => {
    // A. Monthly Stats
    const monthIndex = new Date(tx.timestamp).getMonth();
    activityMap.set(
      monthNames[monthIndex],
      (activityMap.get(monthNames[monthIndex]) || 0) + 1
    );

    // B. Interactions
    tx.interactedWith.forEach((person) => {
      interactionMap.set(person, (interactionMap.get(person) || 0) + 1);
    });

    // C. Asset Analysis
    const changes = tx.balanceChanges as any[];
    if (!Array.isArray(changes)) return;

    let txVolume = 0;

    changes.forEach((change) => {
      let typeStr = "";
      if (typeof change.coinType === "string") {
        typeStr = change.coinType;
      } else if (change.coinType && typeof change.coinType === "object") {
        // Handle legacy data where coinType was { repr: string }
        typeStr = change.coinType.repr || "";
      }

      if (!typeStr) return;

      const isSui =
        typeStr.endsWith("::sui::SUI") || typeStr === "0x2::sui::SUI";
      const symbol = isSui ? "SUI" : typeStr.split("::").pop() || "Unknown";

      const rawAmount = BigInt(change.amount);
      const absAmount = Number(rawAmount < 0 ? -rawAmount : rawAmount) / 1e9;

      assetMap.set(symbol, (assetMap.get(symbol) || 0) + absAmount);

      if (symbol === "SUI") {
        txVolume += absAmount;
        if (rawAmount > 0) inflow += absAmount;
        else outflow += absAmount;
      }
    });

    totalVolume += txVolume;

    if (txVolume > biggestTxAmount) {
      biggestTxAmount = txVolume;
      biggestTxHash = tx.digest;
    }
  });

  // 3. Process Lists
  const topAssets = Array.from(assetMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([symbol, amount]) => ({ symbol, amount }));

  const topInteractors = Array.from(interactionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([address, count]) => ({ address, count }));

  const monthlyActivity = Array.from(activityMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  // 4. Process Recent Transactions
  const recentTransactions = txs.slice(0, 10).map((tx) => {
    const changes = tx.balanceChanges as any[];
    let type = "SEND";
    let amount = 0;

    // Updated safety check here as well
    const suiChange = changes.find((c: any) => {
      const t = typeof c.coinType === "string" ? c.coinType : c.coinType?.repr;
      return t && (t.endsWith("::sui::SUI") || t === "0x2::sui::SUI");
    });

    if (suiChange) {
      const rawVal = BigInt(suiChange.amount);
      amount = Math.abs(Number(rawVal)) / 1e9;
      type = rawVal < 0 ? "SEND" : "RECEIVE";
    }

    return {
      hash: tx.digest,
      type,
      amount,
      symbol: "SUI",
      timestamp: tx.timestamp.getTime(),
      address:
        tx.sender === address ? tx.interactedWith[0] || "Unknown" : tx.sender,
      success: true,
    };
  });

  // 5. Rank & Save
  const archetypeKey = getArchetypeKey(
    totalVolume,
    txs.length,
    inflow,
    outflow
  );
  const archetype =
    ARCHETYPES[archetypeKey].name + " " + ARCHETYPES[archetypeKey].emoji;
  const rankPercentile = Math.max(
    1,
    Math.floor(100 - Math.log(totalVolume + 1) * 5)
  );

  await prisma.userStats.upsert({
    where: { userAddress: address },
    update: {
      totalVolumeUSD: totalVolume,
      inflow,
      outflow,
      peakDay: peakDayResult[0]?.day
        ? new Date(peakDayResult[0].day).toISOString().split("T")[0]
        : "N/A",
      peakDayCount: peakDayResult[0]?.count || 0,
      biggestTxHash,
      biggestTxAmount,
      topAssets: topAssets as any,
      topInteractors: topInteractors as any,
      monthlyActivity: monthlyActivity as any,
      recentTransactions: recentTransactions as any,
      rankPercentile,
      archetype,
      txCount: txs.length,
    },
    create: {
      userAddress: address,
      totalVolumeUSD: totalVolume,
      inflow,
      outflow,
      peakDay: peakDayResult[0]?.day
        ? new Date(peakDayResult[0].day).toISOString().split("T")[0]
        : "N/A",
      peakDayCount: peakDayResult[0]?.count || 0,
      biggestTxHash,
      biggestTxAmount,
      topAssets: topAssets as any,
      topInteractors: topInteractors as any,
      monthlyActivity: monthlyActivity as any,
      recentTransactions: recentTransactions as any,
      rankPercentile,
      archetype,
      txCount: txs.length,
    },
  });

  await prisma.user.update({
    where: { address },
    data: { isIndexed: true, lastIndexedAt: new Date() },
  });
}

function getArchetypeKey(
  volume: number,
  txCount: number,
  inflow: number,
  outflow: number
): keyof typeof ARCHETYPES {
  if (volume > 100000) return "WHALE";
  if (txCount > 50 && volume < 1000) return "DEGEN";
  if (inflow > outflow * 1.5) return "BANKER";
  if (txCount < 5) return "GHOST";
  return "NORMIE";
}
