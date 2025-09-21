import { create } from "zustand";
import type { TokensBalances, TokensDecimals } from "@models/tokens";

interface TokensState {
  tokensBalances: TokensBalances;
  tokensDecimals: TokensDecimals;
  areBalancesLoading: boolean;
}

interface TokensActions {
  setBalances: (balances: TokensBalances) => void;
  setDecimals: (decimals: TokensDecimals) => void;
  setAreBalancesLoading: (areBalancesLoading: boolean) => void;
}

export const useInternalTokensStore = create<TokensState & TokensActions>()(
  (set) => ({
    tokensBalances: {},
    tokensDecimals: {},
    areBalancesLoading: false,
    setBalances: (balances: TokensBalances) =>
      set({ tokensBalances: balances }),
    setDecimals: (decimals: TokensDecimals) =>
      set({ tokensDecimals: decimals }),
    setAreBalancesLoading: (areBalancesLoading: boolean) =>
      set({ areBalancesLoading }),
  }),
);

export default useInternalTokensStore;
