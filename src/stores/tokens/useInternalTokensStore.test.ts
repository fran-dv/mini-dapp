import { renderHook, act } from "@tests/test-utils";
import { useInternalTokensStore } from "./useInternalTokensStore";
import type {
  TokensBalances,
  TokensDecimals,
  TokenEvent,
  TokenConfig,
} from "@models/tokens";
import { describe, beforeEach, test, expect } from "vitest";

describe("useInternalTokensStore", () => {
  beforeEach(() => {
    useInternalTokensStore.setState({
      tokensBalances: {},
      tokensDecimals: {},
      areBalancesLoading: false,
      tokensEvents: [],
      areEventsLoading: false,
      areEventsInitialized: false,
      isFormActionPending: false,
    });
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useInternalTokensStore());

    expect(result.current.tokensBalances).toEqual({});
    expect(result.current.tokensDecimals).toEqual({});
    expect(result.current.areBalancesLoading).toBe(false);
    expect(result.current.tokensEvents).toEqual([]);
    expect(result.current.isFormActionPending).toBe(false);
  });

  test("should update balances correctly", () => {
    const { result } = renderHook(() => useInternalTokensStore());
    const mockBalances: TokensBalances = { DAI: "100.0", USDC: "50.5" };

    act(() => {
      result.current.setBalances(mockBalances);
    });

    expect(result.current.tokensBalances).toEqual(mockBalances);
  });

  test("should update decimals correctly", () => {
    const { result } = renderHook(() => useInternalTokensStore());
    const mockDecimals: TokensDecimals = { DAI: 18, USDC: 6 };

    act(() => {
      result.current.setDecimals(mockDecimals);
    });

    expect(result.current.tokensDecimals).toEqual(mockDecimals);
  });

  test("should update events loading state", () => {
    const { result } = renderHook(() => useInternalTokensStore());

    act(() => {
      result.current.setAreEventsLoading(true);
    });

    expect(result.current.areEventsLoading).toBe(true);
  });

  test("should set token events", () => {
    const { result } = renderHook(() => useInternalTokensStore());
    const mockEvents: TokenEvent[] = [
      {
        kind: "transfer",
        token: {} as TokenConfig,
        txHash: "0x123",
        blockNumber: 1000n,
        from: "0xfrom",
        to: "0xto",
        amount: 1000n,
        readableAmount: "10.0",
      },
    ];

    act(() => {
      result.current.setTokensEvents(mockEvents);
    });

    expect(result.current.tokensEvents).toEqual(mockEvents);
    expect(result.current.areEventsInitialized).toBe(false);
  });

  test("should update form action pending state", () => {
    const { result } = renderHook(() => useInternalTokensStore());

    act(() => {
      result.current.setIsFormActionPending(true);
    });

    expect(result.current.isFormActionPending).toBe(true);
  });
});
