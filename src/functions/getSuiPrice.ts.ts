import { createServerFn } from "@tanstack/react-start";

let cachedPrice: number | null = null;
let lastFetchedTime = 0;
const CACHE_DURATION = 1000 * 60 * 10;

export const getSuiPriceFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const now = Date.now();

    if (cachedPrice && now - lastFetchedTime < CACHE_DURATION) {
      return cachedPrice;
    }

    try {
      console.log("Fetching fresh SUI price from CoinGecko...");
      const apiKey = process.env.COIN_GECKO_API;
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.sui?.usd) {
        cachedPrice = data.sui.usd;
        lastFetchedTime = now;
        return cachedPrice;
      }

      throw new Error("Invalid data format");
    } catch (error) {
      console.error("Failed to fetch SUI price:", error);
      return cachedPrice || 3.42;
    }
  }
);


export const getTopAssetPriceFn = createServerFn({ method: "GET" }).inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {

    const now = Date.now();
    const nameOfAsset = data.name;

    if (cachedPrice && now - lastFetchedTime < CACHE_DURATION) {
      return cachedPrice;
    }

    try {
      console.log(`Fetching fresh ${nameOfAsset} price from CoinGecko...`);
      const apiKey = process.env.COIN_GECKO_API;
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${nameOfAsset}&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.sui?.usd) {
        cachedPrice = data.sui.usd;
        lastFetchedTime = now;
        return cachedPrice;
      }

      throw new Error("Invalid data format");
    } catch (error) {
      console.error("Failed to fetch SUI price:", error);
      return cachedPrice || 3.42;
    }
  }
);