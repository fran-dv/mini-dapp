import type { TokenMarketData } from "@models/tokens";

const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

export const fetchTokenMarketData = async (coinGeckoIds: string[]) => {
  const endpoint = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds.join(",")}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-cg-demo-api-key": COINGECKO_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const data = await response.json();

    const parsedData: TokenMarketData[] = coinGeckoIds.map((coinGeckoId) => ({
      coinGeckoId,
      price: data[coinGeckoId].usd ?? 0,
      priceChange24h: data[coinGeckoId].usd_24h_change ?? 0,
    }));

    return parsedData;
  } catch (err) {
    console.error("Error fetching token market data: ", err);

    throw err;
  }
};

export default fetchTokenMarketData;
