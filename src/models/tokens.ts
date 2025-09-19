import type { Abi } from "viem";

export interface TokenConfig {
  symbol: string;
  name: string;
  address: `0x${string}`;
  abi: Abi;
  coinGeckoId: string;
  decimals?: number;
  logo?: string;
}

export interface TokenMarketData {
  coinGeckoId: string;
  price: number;
  priceChange24h: number;
}
