import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { _chains } from "node_modules/@rainbow-me/rainbowkit/dist/config/getDefaultConfig";
import { sepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? undefined;

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
  chains: supportedChains as unknown as _chains,
  ssr: false,
});
