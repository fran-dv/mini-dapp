import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? undefined;
if (!projectId) console.warn("WalletConnect projectId is missing");

export const supportedChains = [sepolia];
export const defaultChain = sepolia;

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = getDefaultConfig({
  appName: "Wonderland challenge",
  projectId: projectId,
  chains: [sepolia],
  ssr: false,
});
