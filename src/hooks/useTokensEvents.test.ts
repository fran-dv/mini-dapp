import { renderHook } from "@testing-library/react";
import { useTokensEvents } from "./useTokensEvents";
import { useAccount, type Config, type UseAccountReturnType } from "wagmi";
import { viemPublicClient } from "@config/viem.config";
import { Tokens } from "@config/tokens";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { AbiEvent, GetLogsReturnType } from "viem";

// Mock dependencies
vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
}));

vi.mock("@config/viem.config", () => ({
  viemPublicClient: {
    getBlockNumber: vi.fn(),
    getLogs: vi.fn(),
  },
}));

vi.mock("viem", () => ({
  formatUnits: vi.fn((value) => value.toString()),
  parseAbiItem: vi.fn(() => "parsed-abi-item"),
  erc20Abi: [],
}));

const mockUseAccount = vi.mocked(useAccount);
const mockViemPublicClient = vi.mocked(viemPublicClient);

describe("useTokensEvents", () => {
  const mockWalletAddress = "0x742E6d90E8B6cD6eD6D4a9B40dC59d56a6E1345E";

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccount.mockReturnValue({
      address: mockWalletAddress,
    } as unknown as UseAccountReturnType<Config>);
    mockViemPublicClient.getBlockNumber.mockResolvedValue(10000n);
  });

  test("should return empty array when no wallet address", async () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
    } as unknown as UseAccountReturnType<Config>);

    const { result } = renderHook(() => useTokensEvents());
    const events = await result.current.getEvents();

    expect(events).toEqual([]);
  });

  test("should fetch and transform approval events correctly", async () => {
    const mockApprovalLogs = [
      {
        address: Tokens.DAI.address,
        transactionHash: "0x123",
        blockNumber: 9990n,
        args: {
          owner: mockWalletAddress,
          spender: "0xspender",
          value: 1000000000000000000n,
        },
      },
    ];

    mockViemPublicClient.getLogs.mockResolvedValueOnce(
      mockApprovalLogs as unknown as GetLogsReturnType<AbiEvent>,
    );
    mockViemPublicClient.getLogs.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTokensEvents());
    const events = await result.current.getEvents();

    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe("approval");
    expect(events[0].token.symbol).toBe("DAI");
    expect((events[0] as { owner: string }).owner).toBe(mockWalletAddress);
    expect(mockViemPublicClient.getLogs).toHaveBeenCalledWith({
      address: expect.any(Array),
      event: "parsed-abi-item",
      args: { owner: mockWalletAddress },
      toBlock: "latest",
      fromBlock: 10000n - 9990n, // 10n
    });
  });

  test("should filter out events with unknown tokens", async () => {
    const mockLogsWithUnknownToken = [
      {
        address: "0xUnknownToken", // Not in Tokens config
        transactionHash: "0x123",
        blockNumber: 9990n,
        args: {
          owner: mockWalletAddress,
          spender: "0xspender",
          value: 1000000000000000000n,
        },
      },
    ];

    mockViemPublicClient.getLogs.mockResolvedValueOnce(
      mockLogsWithUnknownToken as unknown as GetLogsReturnType<AbiEvent>,
    );
    mockViemPublicClient.getLogs.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTokensEvents());
    const events = await result.current.getEvents();

    expect(events).toHaveLength(0);
  });

  test("should sort events by block number descending", async () => {
    const mockLogs = [
      {
        address: Tokens.DAI.address,
        transactionHash: "0x1",
        blockNumber: 9995n,
        args: { owner: mockWalletAddress, spender: "0xs", value: 1000n },
      },
      {
        address: Tokens.USDC.address,
        transactionHash: "0x2",
        blockNumber: 9998n,
        args: { owner: mockWalletAddress, spender: "0xs", value: 2000n },
      },
    ];

    mockViemPublicClient.getLogs.mockResolvedValueOnce(
      mockLogs as unknown as GetLogsReturnType<AbiEvent>,
    );
    mockViemPublicClient.getLogs.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTokensEvents());
    const events = await result.current.getEvents();

    expect(events[0].blockNumber).toBe(9998n);
    expect(events[1].blockNumber).toBe(9995n);
  });

  test("should handle errors gracefully", async () => {
    mockViemPublicClient.getLogs.mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useTokensEvents());

    await expect(result.current.getEvents()).rejects.toThrow("Network error");
  });
});
