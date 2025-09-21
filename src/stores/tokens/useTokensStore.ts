import useTokensData from "@hooks/useTokensData";
import useInternalTokensStore from "./useInternalTokensStore";
import type { TokensBalances, TokensDecimals } from "@models/tokens";
import { useEffect } from "react";

interface TokensStore {
  areBalancesLoading: boolean;
  tokensBalances: TokensBalances;
  tokensDecimals: TokensDecimals;
}

export const useTokensStore = (): TokensStore => {
  const { balances, decimals, isLoading } = useTokensData();
  const {
    setBalances,
    setDecimals,
    setAreBalancesLoading,
    areBalancesLoading,
    tokensBalances,
    tokensDecimals,
  } = useInternalTokensStore();

  useEffect(() => {
    setBalances(balances);
    setDecimals(decimals);
    setAreBalancesLoading(isLoading);
  }, [
    setBalances,
    setDecimals,
    setAreBalancesLoading,
    balances,
    decimals,
    isLoading,
  ]);

  return {
    areBalancesLoading,
    tokensBalances,
    tokensDecimals,
  };
};

export default useTokensStore;
