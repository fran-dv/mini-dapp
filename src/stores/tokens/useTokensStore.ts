import useTokensData from "@hooks/useTokensData";
import { useTokensEvents } from "@hooks/useTokensEvents";
import useInternalTokensStore from "./useInternalTokensStore";
import type {
  TokensBalances,
  TokensDecimals,
  TokenEvent,
} from "@models/tokens";
import { useEffect } from "react";

export interface TokensStore {
  areBalancesLoading: boolean;
  tokensBalances: TokensBalances;
  tokensDecimals: TokensDecimals;
  tokensEvents: TokenEvent[];
  areEventsInitialized: boolean;
  areEventsLoading: boolean;
  isFormActionPending: boolean;
  refreshBalances: () => void;
  startFormAction: () => void;
  loadEvents: () => void;
  finishFormAction: () => void;
}

export const useTokensStore = (): TokensStore => {
  const { balances, decimals, isLoading, refetchBalances } = useTokensData();
  const { getEvents } = useTokensEvents();
  const {
    setBalances,
    setDecimals,
    setAreBalancesLoading,
    setTokensEvents,
    setAreEventsLoading,
    setAreEventsInitialized,
    setIsFormActionPending,
    areBalancesLoading,
    tokensBalances,
    tokensDecimals,
    tokensEvents,
    areEventsInitialized,
    areEventsLoading,
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

  const loadEvents = async () => {
    setAreEventsLoading(true);
    try {
      const events: TokenEvent[] = await getEvents();
      setTokensEvents(events);
      setAreEventsInitialized(true);
    } finally {
      setAreEventsLoading(false);
    }
  };

  return {
    areBalancesLoading,
    tokensBalances,
    tokensDecimals,
    tokensEvents,
    areEventsInitialized,
    areEventsLoading,
    isFormActionPending,
    refreshBalances: () => refetchBalances(),
    startFormAction: () => setIsFormActionPending(true),
    loadEvents,
    finishFormAction: () => setIsFormActionPending(false),
  };
};

export default useTokensStore;
