import { Tokens } from "@config/tokens";
import {
  useAccount,
  useBlockNumber,
  useReadContracts,
  type UseReadContractsReturnType,
} from "wagmi";
import { formatUnits } from "viem";
import type { TokensBalances, TokensDecimals } from "@models/tokens";
import { useEffect, useMemo } from "react";

const tokens = Object.values(Tokens);

interface UseTokensDataReturnType {
  decimals: TokensDecimals;
  balances: TokensBalances;
  isLoading: boolean;
}

export const useTokensData = (): UseTokensDataReturnType => {
  const { isConnected, address } = useAccount();
  const contracts = tokens.flatMap((token) => [
    {
      address: token.address,
      abi: token.abi,
      functionName: "balanceOf" as const,
      args: [address!],
    },
    {
      address: token.address,
      abi: token.abi,
      functionName: "decimals" as const,
    },
  ]);

  const {
    data: results,
    isLoading: areBalancesLoading,
    refetch,
  }: UseReadContractsReturnType = useReadContracts({
    contracts: contracts,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    if (blockNumber && Number(blockNumber) % 5 === 0) refetch();
  }, [blockNumber, refetch]);

  const decimals: TokensDecimals = useMemo(() => {
    const decimals: TokensDecimals = {};
    tokens.map((token, i) => {
      const decimalsResult = results?.[i * 2 + 1];
      decimals[token.symbol] =
        (decimalsResult?.result as number) ?? token.decimals!;
    });
    return decimals;
  }, [results]);

  const balances: TokensBalances = useMemo(() => {
    const balances: TokensBalances = {};
    tokens.map((token, i) => {
      const balanceResult = results?.[i * 2];
      const decimalsResult = results?.[i * 2 + 1];

      const rawBalance = (balanceResult?.result as bigint) ?? 0n;
      const decimals = (decimalsResult?.result as number) ?? token.decimals!;

      const cleanBalance = formatUnits(rawBalance, decimals);

      balances[token.symbol] = cleanBalance;
    });
    return balances;
  }, [results]);

  return {
    decimals,
    balances,
    isLoading: areBalancesLoading,
  };
};

export default useTokensData;
