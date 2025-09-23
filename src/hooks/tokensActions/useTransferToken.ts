import type { TokenConfig } from "@models/tokens";
import { useWriteContract } from "wagmi";
import type { WriteContractData } from "wagmi/query";
import { useAccount } from "wagmi";
import { isAddress, parseUnits } from "viem";
import useUserMessages from "@hooks/useUserMessages";
import useTokensStore from "@stores/tokens/useTokensStore";

export interface TransferParams {
  token: TokenConfig;
  amount: string;
  recipient: string;
}

interface UseTransferTokenReturnType {
  transfer: ({
    token,
    amount,
    recipient,
  }: TransferParams) => Promise<WriteContractData | undefined>;
  isPending: boolean;
  error: Error | null;
}
export const useTransferToken = (): UseTransferTokenReturnType => {
  const { address: userAddress } = useAccount();
  const { showError } = useUserMessages();
  const { tokensDecimals } = useTokensStore();

  const { writeContractAsync, isPending, error } = useWriteContract();

  const transfer = async ({ token, amount, recipient }: TransferParams) => {
    if (!userAddress) {
      console.error("User not connected");
      showError("Transfer failed: wallet not connected");
      return undefined;
    }

    if (!isAddress(token.address)) {
      console.error(`Invalid token address: ${token.address}`);
      showError("Transfer failed: invalid token contract address");
      return undefined;
    }

    if (!isAddress(recipient)) {
      console.error(`Invalid recipient address: ${recipient}`);
      showError(`Transfer failed: Invalid recipient address: ${recipient}`);
      return undefined;
    }

    const parsedAmount = parseUnits(amount, tokensDecimals[token.symbol]);

    try {
      return await writeContractAsync({
        abi: token.abi,
        address: token.address,
        functionName: "transfer",
        args: [recipient, parsedAmount],
      });
    } catch (err) {
      console.error("Transfer contract error:", err);
      showError("There was an error in the transfer");
      return undefined;
    }
  };

  return {
    transfer,
    isPending,
    error,
  };
};

export default useTransferToken;
