import { create } from "zustand";
import type {
  TokensBalances,
  TokensDecimals,
  TokenEvent,
} from "@models/tokens";

interface TokensState {
  tokensBalances: TokensBalances;
  tokensDecimals: TokensDecimals;
  areBalancesLoading: boolean;
  tokensEvents: TokenEvent[];
  areEventsLoading: boolean;
  areEventsInitialized: boolean;
  isFormActionPending: boolean;
}

interface TokensActions {
  setBalances: (balances: TokensBalances) => void;
  setDecimals: (decimals: TokensDecimals) => void;
  setAreBalancesLoading: (areBalancesLoading: boolean) => void;
  setTokensEvents: (events: TokenEvent[]) => void;
  setAreEventsLoading: (areEventsLoading: boolean) => void;
  setAreEventsInitialized: (areEventsInitialized: boolean) => void;
  setIsFormActionPending: (isFormActionPending: boolean) => void;
}

export const useInternalTokensStore = create<TokensState & TokensActions>()(
  (set) => ({
    tokensBalances: {},
    tokensDecimals: {},
    areBalancesLoading: false,
    tokensEvents: [],
    areEventsLoading: false,
    areEventsInitialized: false,
    isFormActionPending: false,
    setBalances: (balances: TokensBalances) =>
      set({ tokensBalances: balances }),
    setDecimals: (decimals: TokensDecimals) =>
      set({ tokensDecimals: decimals }),
    setAreBalancesLoading: (areBalancesLoading: boolean) =>
      set({ areBalancesLoading }),
    setTokensEvents: (events: TokenEvent[]) => set({ tokensEvents: events }),
    setAreEventsLoading: (areEventsLoading: boolean) =>
      set({ areEventsLoading }),
    setAreEventsInitialized: (areEventsInitialized: boolean) =>
      set({ areEventsInitialized }),
    setIsFormActionPending: (isFormActionPending: boolean) =>
      set({ isFormActionPending }),
  }),
);

export default useInternalTokensStore;
