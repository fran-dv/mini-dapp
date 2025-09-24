import { renderHook, act } from "@testing-library/react";
import { useApproveToken } from "./useApproveToken";
import {
  useAccount,
  useWriteContract,
  type Config,
  type UseAccountReturnType,
  type UseWriteContractReturnType,
} from "wagmi";
import {
  useUserMessages,
  type UseUserMessagesReturnType,
} from "@hooks/useUserMessages";
import useTokensStore, {
  type TokensStore,
} from "@stores/tokens/useTokensStore";
import { isAddress, parseUnits } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { TokenConfig } from "@models/tokens";
import type { WriteContractData } from "wagmi/query";

vi.mock("wagmi");
vi.mock("wagmi/query");
vi.mock("@hooks/useUserMessages");
vi.mock("@stores/tokens/useTokensStore");
vi.mock("viem", async () => {
  const actual = await vi.importActual("viem");
  return {
    ...actual,
    isAddress: vi.fn(),
    parseUnits: vi.fn(),
  };
});

const mockUseAccount = vi.mocked(useAccount);
const mockUseWriteContract = vi.mocked(useWriteContract);
const mockUseUserMessages = vi.mocked(useUserMessages);
const mockUseTokensStore = vi.mocked(useTokensStore);
const mockIsAddress = vi.mocked(isAddress);
const mockParseUnits = vi.mocked(parseUnits);

describe("useApproveToken", () => {
  const mockShowError = vi.fn();
  const mockWriteContractAsync = vi.fn();

  const mockToken: TokenConfig = {
    symbol: "DAI",
    name: "DAI Stablecoin",
    address: "0x1D70D57ccD2798323232B2dD027B3aBcA5C00091",
    abi: [],
    coinGeckoId: "dai",
    decimals: 18,
  };

  const mockUserAddress = "0x742E6d90E8B6cD6eD6D4a9B40dC59d56a6E1345E";
  const mockSpenderAddress = "0x3Fc9B7C1A0a1D6d8A2A2a2a2a2a2a2a2a2a2a2a2";

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAccount.mockReturnValue({
      address: mockUserAddress,
    } as unknown as UseAccountReturnType<Config>);
    mockUseWriteContract.mockReturnValue({
      writeContractAsync: mockWriteContractAsync,
      isPending: false,
      error: null,
    } as unknown as UseWriteContractReturnType<Config, unknown>);
    mockUseUserMessages.mockReturnValue({
      showError: mockShowError,
    } as unknown as UseUserMessagesReturnType);
    mockUseTokensStore.mockReturnValue({
      tokensDecimals: { DAI: 18, USDC: 6 },
    } as unknown as TokensStore);
    mockIsAddress.mockReturnValue(true);
    mockParseUnits.mockReturnValue(1000000000000000000n);
  });

  test("should return approve function and state", () => {
    const { result } = renderHook(() => useApproveToken());

    expect(result.current.approve).toBeInstanceOf(Function);
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("should return undefined and show error when user is not connected", async () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
    } as unknown as UseAccountReturnType<Config>);

    const { result } = renderHook(() => useApproveToken());

    const approveResult = await act(async () => {
      return await result.current.approve({
        token: mockToken,
        amount: "10",
        spender: mockSpenderAddress,
      });
    });

    expect(approveResult).toBeUndefined();
    expect(mockShowError).toHaveBeenCalledWith(
      "Approve failed: wallet not connected",
    );
  });

  test("should call writeContractAsync with correct parameters when everything is valid", async () => {
    const mockTransactionHash = "0x1234567890abcdef";
    mockWriteContractAsync.mockResolvedValue(
      mockTransactionHash as WriteContractData,
    );
    mockParseUnits.mockReturnValue(1000000000000000000n);

    const { result } = renderHook(() => useApproveToken());

    const approveResult = await act(async () => {
      return await result.current.approve({
        token: mockToken,
        amount: "1.0",
        spender: mockSpenderAddress,
      });
    });

    expect(mockParseUnits).toHaveBeenCalledWith("1.0", 18);
    expect(mockWriteContractAsync).toHaveBeenCalledWith({
      abi: mockToken.abi,
      address: mockToken.address,
      functionName: "approve",
      args: [mockSpenderAddress, 1000000000000000000n],
    });
    expect(approveResult).toBe(mockTransactionHash);
  });

  test("should handle contract execution errors gracefully", async () => {
    const contractError = new Error("Contract execution reverted");
    mockWriteContractAsync.mockRejectedValue(contractError);

    const { result } = renderHook(() => useApproveToken());

    const approveResult = await act(async () => {
      return await result.current.approve({
        token: mockToken,
        amount: "10",
        spender: mockSpenderAddress,
      });
    });

    expect(approveResult).toBeUndefined();
    expect(mockShowError).toHaveBeenCalledWith(
      "There was an error in the approve",
    );
  });

  test("should use correct decimals from store for amount parsing", async () => {
    mockUseTokensStore.mockReturnValue({
      tokensDecimals: { DAI: 18, USDC: 6 },
    } as unknown as TokensStore);

    const { result } = renderHook(() => useApproveToken());

    await act(async () => {
      await result.current.approve({
        token: mockToken,
        amount: "1.5",
        spender: mockSpenderAddress,
      });
    });

    expect(mockParseUnits).toHaveBeenCalledWith("1.5", 18);
  });

  test("should reflect pending state from writeContract", () => {
    mockUseWriteContract.mockReturnValue({
      writeContractAsync: mockWriteContractAsync,
      isPending: true,
      error: null,
    } as unknown as UseWriteContractReturnType<Config, unknown>);

    const { result } = renderHook(() => useApproveToken());

    expect(result.current.isPending).toBe(true);
  });

  test("should reflect error state from writeContract", () => {
    const mockError = new Error("Network error");
    mockUseWriteContract.mockReturnValue({
      writeContractAsync: mockWriteContractAsync,
      isPending: false,
      error: mockError,
    } as unknown as UseWriteContractReturnType<Config, unknown>);

    const { result } = renderHook(() => useApproveToken());

    expect(result.current.error).toBe(mockError);
  });

  test("should handle token with different decimals correctly", async () => {
    const usdcToken = { ...mockToken, symbol: "USDC", decimals: 6 };
    mockUseTokensStore.mockReturnValue({
      tokensDecimals: { DAI: 18, USDC: 6 },
    } as unknown as TokensStore);

    const { result } = renderHook(() => useApproveToken());

    await act(async () => {
      await result.current.approve({
        token: usdcToken,
        amount: "100.5",
        spender: mockSpenderAddress,
      });
    });

    expect(mockParseUnits).toHaveBeenCalledWith("100.5", 6);
  });
});
