import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export const viemPublicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});
