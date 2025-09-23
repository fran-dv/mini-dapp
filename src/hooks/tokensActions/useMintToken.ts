import type { TokenConfig } from "@models/tokens";
import { useWriteContract } from "wagmi";
import type { WriteContractData } from "wagmi/query";
import { useAccount } from "wagmi";
import { isAddress, parseUnits } from "viem";
import { useUserMessages } from "@hooks/useUserMessages";
import useTokensStore from "@stores/tokens/useTokensStore";

export interface MintParams {
  token: TokenConfig;
  amount: string;
}

interface UseMintTokenReturnType {
  mint: ({
    token,
    amount,
  }: MintParams) => Promise<WriteContractData | undefined>;
  isPending: boolean;
  error: Error | null;
}
export const useMintToken = (): UseMintTokenReturnType => {
  const { address: userAddress } = useAccount();
  const { showError } = useUserMessages();
  const { tokensDecimals } = useTokensStore();

  const { writeContractAsync, isPending, error } = useWriteContract();

  const mint = async ({ token, amount }: MintParams) => {
    if (!userAddress) {
      console.error("User not connected");
      showError("Mint failed: Wallet not connected");
      return undefined;
    }

    if (!isAddress(token.address)) {
      console.error(`Invalid token address: ${token.address}`);
      showError(`Mint failed: Invalid token address: ${token.address}`);
      return undefined;
    }

    const parsedAmount = parseUnits(amount, tokensDecimals[token.symbol]);

    try {
      return await writeContractAsync({
        abi: token.abi,
        address: token.address,
        functionName: "mint",
        args: [userAddress, parsedAmount],
      });
    } catch (err) {
      console.error("Mint contract error:", err);
      showError("There was an error minting the token");
      return undefined;
    }
  };

  return {
    mint,
    isPending,
    error,
  };
};

export default useMintToken;
