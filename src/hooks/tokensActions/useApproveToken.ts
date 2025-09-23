import type { TokenConfig } from "@models/tokens";
import { useWriteContract } from "wagmi";
import type { WriteContractData } from "wagmi/query";
import { useAccount } from "wagmi";
import { isAddress, parseUnits } from "viem";
import useUserMessages from "@hooks/useUserMessages";
import useTokensStore from "@stores/tokens/useTokensStore";

export interface ApproveParams {
  token: TokenConfig;
  amount: string;
  spender: string;
}

interface UseApproveTokenReturnType {
  approve: ({
    token,
    amount,
    spender,
  }: ApproveParams) => Promise<WriteContractData | undefined>;
  isPending: boolean;
  error: Error | null;
}
export const useApproveToken = (): UseApproveTokenReturnType => {
  const { address: userAddress } = useAccount();
  const { showError } = useUserMessages();
  const { tokensDecimals } = useTokensStore();

  const { writeContractAsync, isPending, error } = useWriteContract();

  const approve = async ({ token, amount, spender }: ApproveParams) => {
    if (!userAddress) {
      console.error("User not connected");
      showError("Approve failed: wallet not connected");
      return undefined;
    }

    if (!isAddress(token.address)) {
      console.error(`Invalid token address: ${token.address}`);
      showError("Approve failed: invalid token contract address");
      return undefined;
    }

    if (!isAddress(spender)) {
      console.error(`Invalid spender address: ${spender}`);
      showError(`Approve failed: Invalid spender address: ${spender}`);
      return undefined;
    }

    const parsedAmount = parseUnits(amount, tokensDecimals[token.symbol]);

    try {
      return await writeContractAsync({
        abi: token.abi,
        address: token.address,
        functionName: "approve",
        args: [spender, parsedAmount],
      });
    } catch (err) {
      console.error("Approve contract error:", err);
      showError("There was an error in the approve");
      return undefined;
    }
  };

  return {
    approve,
    isPending,
    error,
  };
};

export default useApproveToken;
