import { erc20Abi } from "viem";
import daiLogo from "@assets/logos/dai.svg";
import usdcLogo from "@assets/logos/usdc.svg";
import type { TokenConfig } from "@models/tokens";

export const Tokens: Record<string, TokenConfig> = {
  DAI: {
    symbol: "DAI",
    name: "DAI (Sepolia)",
    address: "0x1D70D57ccD2798323232B2dD027B3aBcA5C00091",
    abi: erc20Abi,
    decimals: 18,
    coinGeckoId: "dai",
    logo: daiLogo,
  },
  USDC: {
    symbol: "USDC",
    name: "USDC (Sepolia)",
    address: "0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47",
    abi: erc20Abi,
    decimals: 6,
    coinGeckoId: "usd-coin",
    logo: usdcLogo,
  },
} as const;

export type TokenSymbol = keyof typeof Tokens;
