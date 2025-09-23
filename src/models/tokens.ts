import type { TokenSymbol } from "@config/tokens";
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

export type TokenEvent =
  | {
      kind: "transfer";
      token: TokenConfig;
      txHash: `0x${string}`;
      blockNumber: bigint;
      from: `0x${string}`;
      to: `0x${string}`;
      amount: bigint;
      readableAmount: string;
      timestamp?: Date;
    }
  | {
      kind: "approval";
      token: TokenConfig;
      txHash: `0x${string}`;
      blockNumber: bigint;
      owner: `0x${string}`;
      spender: `0x${string}`;
      amount: bigint;
      readableAmount: string;
      timestamp?: Date;
    };

export interface TokensBalances {
  [key: TokenSymbol]: string;
}

export interface TokensDecimals {
  [key: TokenSymbol]: number;
}
