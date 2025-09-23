import useTokensData from "@hooks/useTokensData";
import useInternalTokensStore from "./useInternalTokensStore";
import type { TokensBalances, TokensDecimals } from "@models/tokens";
import { useEffect } from "react";

interface TokensStore {
  areBalancesLoading: boolean;
  tokensBalances: TokensBalances;
  tokensDecimals: TokensDecimals;
  isFormActionPending: boolean;
  refreshBalances: () => void;
  startFormAction: () => void;
  finishFormAction: () => void;
}

export const useTokensStore = (): TokensStore => {
  const { balances, decimals, isLoading, refetchBalances } = useTokensData();
  const {
    setBalances,
    setDecimals,
    setAreBalancesLoading,
    setIsFormActionPending,
    areBalancesLoading,
    tokensBalances,
    tokensDecimals,
    isFormActionPending,
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
    isFormActionPending,
    refreshBalances: () => refetchBalances(),
    startFormAction: () => setIsFormActionPending(true),
    finishFormAction: () => setIsFormActionPending(false),
  };
};

export default useTokensStore;
