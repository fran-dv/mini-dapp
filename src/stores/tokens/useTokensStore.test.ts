import { renderHook, act, waitFor } from "@testing-library/react";
import { useTokensStore } from "./useTokensStore";
import useTokensData from "@hooks/useTokensData";
import useTokensEvents from "@hooks/useTokensEvents";
import useInternalTokensStore from "./useInternalTokensStore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { TokenConfig, TokenEvent } from "@/models/tokens";

vi.mock("@hooks/useTokensData");
vi.mock("@hooks/useTokensEvents");
vi.mock("./useInternalTokensStore");

const mockUseTokensData = vi.mocked(useTokensData);
const mockUseTokensEvents = vi.mocked(useTokensEvents);
const mockUseInternalTokensStore = vi.mocked(useInternalTokensStore);

describe("useTokensStore", () => {
  const mockBalances = { DAI: "100.5", USDC: "250.75" };
  const mockDecimals = { DAI: 18, USDC: 6 };
  const mockTokenEvents: TokenEvent[] = [
    {
      kind: "transfer",
      token: { symbol: "DAI", name: "DAI Stablecoin" } as TokenConfig,
      txHash: "0x123abc",
      blockNumber: 19283472n,
      from: "0xuser1",
      to: "0xuser2",
      amount: 5000000000000000000n,
      readableAmount: "5.0",
    },
  ];

  const defaultInternalStoreMock = {
    tokensBalances: mockBalances,
    tokensDecimals: mockDecimals,
    areBalancesLoading: false,
    tokensEvents: mockTokenEvents,
    areEventsLoading: false,
    areEventsInitialized: true,
    isFormActionPending: false,
    setBalances: vi.fn(),
    setDecimals: vi.fn(),
    setAreBalancesLoading: vi.fn(),
    setTokensEvents: vi.fn(),
    setAreEventsLoading: vi.fn(),
    setAreEventsInitialized: vi.fn(),
    setIsFormActionPending: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseInternalTokensStore.mockReturnValue({
      tokensBalances: mockBalances,
      tokensDecimals: mockDecimals,
      areBalancesLoading: false,
      tokensEvents: mockTokenEvents,
      areEventsLoading: false,
      areEventsInitialized: true,
      isFormActionPending: false,
      setBalances: vi.fn(),
      setDecimals: vi.fn(),
      setAreBalancesLoading: vi.fn(),
      setTokensEvents: vi.fn(),
      setAreEventsLoading: vi.fn(),
      setAreEventsInitialized: vi.fn(),
      setIsFormActionPending: vi.fn(),
    });

    mockUseTokensData.mockReturnValue({
      balances: mockBalances,
      decimals: mockDecimals,
      isLoading: false,
      refetchBalances: vi.fn(),
    });

    mockUseTokensEvents.mockReturnValue({
      getEvents: vi.fn().mockResolvedValue(mockTokenEvents),
    });
  });

  test("should return correct token balances and decimals", () => {
    const { result } = renderHook(() => useTokensStore());

    expect(result.current.tokensBalances).toEqual(mockBalances);
    expect(result.current.tokensDecimals).toEqual(mockDecimals);
    expect(result.current.areBalancesLoading).toBe(false);
  });

  test("should return correct events state", () => {
    const { result } = renderHook(() => useTokensStore());

    expect(result.current.tokensEvents).toEqual(mockTokenEvents);
    expect(result.current.areEventsInitialized).toBe(true);
    expect(result.current.areEventsLoading).toBe(false);
  });

  test("should refresh balances when refreshBalances is called", () => {
    const mockRefetch = vi.fn();
    mockUseTokensData.mockReturnValue({
      balances: mockBalances,
      decimals: mockDecimals,
      isLoading: false,
      refetchBalances: mockRefetch,
    });

    const { result } = renderHook(() => useTokensStore());

    act(() => {
      result.current.refreshBalances();
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  test("should manage form action states correctly", () => {
    const mockSetIsFormActionPending = vi.fn();
    mockUseInternalTokensStore.mockReturnValue({
      ...defaultInternalStoreMock,
      setIsFormActionPending: mockSetIsFormActionPending,
    });

    const { result } = renderHook(() => useTokensStore());

    act(() => {
      result.current.startFormAction();
    });

    expect(mockSetIsFormActionPending).toHaveBeenCalledWith(true);

    act(() => {
      result.current.finishFormAction();
    });

    expect(mockSetIsFormActionPending).toHaveBeenCalledWith(false);
  });

  test("should load events successfully and update state", async () => {
    const mockSetTokensEvents = vi.fn();
    const mockSetAreEventsInitialized = vi.fn();
    const mockSetAreEventsLoading = vi.fn();

    mockUseInternalTokensStore.mockReturnValue({
      ...defaultInternalStoreMock,
      setTokensEvents: mockSetTokensEvents,
      setAreEventsInitialized: mockSetAreEventsInitialized,
      setAreEventsLoading: mockSetAreEventsLoading,
    });

    const { result } = renderHook(() => useTokensStore());
    act(() => {
      result.current.loadEvents();
    });

    expect(mockSetAreEventsLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(result.current.areEventsLoading).toBe(false);
      expect(result.current.areEventsInitialized).toBe(true);
    });
  });

  test("should reflect loading state when data is being fetched", () => {
    mockUseInternalTokensStore.mockReturnValue({
      ...defaultInternalStoreMock,
      areBalancesLoading: true,
    });

    const { result } = renderHook(() => useTokensStore());

    expect(result.current.areBalancesLoading).toBe(true);
  });

  test("should reflect form action pending state", () => {
    mockUseInternalTokensStore.mockReturnValue({
      ...defaultInternalStoreMock,
      isFormActionPending: true,
    });

    const { result } = renderHook(() => useTokensStore());

    expect(result.current.isFormActionPending).toBe(true);
  });
});
