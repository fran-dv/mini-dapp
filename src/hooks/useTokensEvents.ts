import type { TokenEvent } from "@models/tokens";
import { useAccount } from "wagmi";
import { viemPublicClient } from "@config/viem.config";
import { Tokens } from "@config/tokens";
import { formatUnits, parseAbiItem } from "viem";

type GetEventsReturnType = Promise<TokenEvent[]>;

interface UseTokensEventsReturnType {
  getEvents: () => GetEventsReturnType;
}

const tokens = Object.values(Tokens);

export const useTokensEvents = (): UseTokensEventsReturnType => {
  const { address: walletAddress } = useAccount();

  const getEvents = async (): GetEventsReturnType => {
    if (!walletAddress) {
      console.error("No wallet address available");
      return [];
    }
    const latestBlock = await viemPublicClient.getBlockNumber();

    const approvalLogs = await viemPublicClient.getLogs({
      address: tokens.map((token) => token.address),
      event: parseAbiItem(
        "event Approval(address indexed owner, address indexed spender, uint256 value)",
      ),
      args: {
        owner: walletAddress,
      },
      toBlock: "latest",
      fromBlock: latestBlock - 9990n,
    });

    const transferLogs = await viemPublicClient.getLogs({
      address: tokens.map((token) => token.address),
      event: parseAbiItem(
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ),
      args: {
        from: walletAddress,
      },
      toBlock: "latest",
      fromBlock: latestBlock - 10000n,
    });

    const approvalEvents: (TokenEvent | null)[] = approvalLogs.map((log) => {
      const token = tokens.find(
        (token) => token.address.toLowerCase() === log.address.toLowerCase(),
      );
      if (!token) {
        console.error(
          "Token not found in approval log with address: ",
          log.address,
        );
        return null;
      }
      const event: TokenEvent = {
        kind: "approval",
        token: token,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        owner: log.args.owner!,
        spender: log.args.spender!,
        amount: log.args.value!,
        readableAmount: formatUnits(log.args.value ?? 0n, token.decimals!),
      };
      return event;
    });

    const transferEvents: (TokenEvent | null)[] = transferLogs.map((log) => {
      const token = tokens.find(
        (token) => token.address.toLowerCase() === log.address.toLowerCase(),
      );
      if (!token) {
        console.error(
          "Token not found in transfer event log with address: ",
          log.address,
        );
        return null;
      }
      const event: TokenEvent = {
        kind: "transfer",
        token: token,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        from: log.args.from!,
        to: log.args.to!,
        amount: log.args.value!,
        readableAmount: formatUnits(
          log.args.value ?? 0n,
          tokens.find((token) => token.address === log.address)?.decimals ?? 18,
        ),
      };
      return event;
    });

    const events = [...approvalEvents, ...transferEvents].filter(
      (event): event is TokenEvent => event !== null,
    );
    return events.sort((a, b) => (a.blockNumber > b.blockNumber ? -1 : 1));
  };

  return {
    getEvents,
  };
};

export default useTokensEvents;
