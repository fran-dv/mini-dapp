import { renderHook, waitFor } from "@testing-library/react";
import { useTokensData } from "./useTokensData";
import {
  useAccount,
  useBlockNumber,
  useReadContracts,
  type Config,
  type UseAccountReturnType,
  type UseBlockNumberReturnType,
  type UseReadContractsReturnType,
} from "wagmi";
import { formatUnits } from "viem";
import { Tokens } from "@config/tokens";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
  useBlockNumber: vi.fn(),
  useReadContracts: vi.fn(),
}));

vi.mock("viem", () => ({
  formatUnits: vi.fn(),
  erc20Abi: [],
}));

const mockUseAccount = vi.mocked(useAccount);
const mockUseBlockNumber = vi.mocked(useBlockNumber);
const mockUseReadContracts = vi.mocked(useReadContracts);
const mockFormatUnits = vi.mocked(formatUnits);

describe("useTokensData", () => {
  const mockAddress = "0x742E6d90E8B6cD6eD6D4a9B40dC59d56a6E1345E";

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: mockAddress,
    } as unknown as UseAccountReturnType<Config>);

    mockUseBlockNumber.mockReturnValue({
      data: 1000n,
    } as UseBlockNumberReturnType<unknown>);

    mockFormatUnits.mockImplementation((value, decimals) => {
      return (Number(value) / Math.pow(10, Number(decimals))).toString();
    });
  });

  test("should return loading state is loading is true", () => {
    mockUseReadContracts.mockReturnValue({
      data: undefined,
      isLoading: true,
      refetch: vi.fn(),
    } as unknown as UseReadContractsReturnType<
      readonly unknown[],
      boolean,
      unknown
    >);

    const { result } = renderHook(() => useTokensData());

    expect(result.current.isLoading).toBe(true);
  });

  test("should transform contract results correctly", () => {
    const mockResults = [
      { result: 1000000000000000000n }, // DAI balance
      { result: 18 }, // DAI decimals
      { result: 50000000n }, // USDC balance
      { result: 6 }, // USDC decimals
    ];

    mockUseReadContracts.mockReturnValue({
      data: mockResults,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as UseReadContractsReturnType<
      readonly unknown[],
      boolean,
      unknown
    >);

    const { result } = renderHook(() => useTokensData());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.decimals).toEqual({
      DAI: 18,
      USDC: 6,
    });
    expect(result.current.balances).toEqual({
      DAI: "1",
      USDC: "50",
    });
  });

  test("should refetch balances every 5 blocks", async () => {
    const mockRefetch = vi.fn();
    mockUseReadContracts.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: mockRefetch,
    } as unknown as UseReadContractsReturnType<
      readonly unknown[],
      boolean,
      unknown
    >);

    mockUseBlockNumber.mockReturnValue({
      data: 15n,
    } as UseBlockNumberReturnType<unknown>);

    renderHook(() => useTokensData());

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  test("should handle missing results gracefully", () => {
    const mockResults = [
      { result: 1000000000000000000n }, // DAI balance
      null, // Missing decimals for DAI
      undefined, // Missing USDC balance
      { result: 6 }, // USDC decimals
    ];

    mockUseReadContracts.mockReturnValue({
      data: mockResults,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as UseReadContractsReturnType<
      readonly unknown[],
      boolean,
      unknown
    >);

    const { result } = renderHook(() => useTokensData());

    expect(result.current.decimals.DAI).toBe(Tokens.DAI.decimals);
    expect(result.current.balances.USDC).toBe("0");
  });
});
