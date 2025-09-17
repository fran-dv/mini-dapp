import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { _chains } from "node_modules/@rainbow-me/rainbowkit/dist/config/getDefaultConfig";
import type { Config } from "wagmi";
import { sepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? undefined;

export const supportedChains = [sepolia];
export const defaultChain = sepolia;

export const config: Config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: projectId,
  chains: supportedChains as unknown as _chains,
  ssr: false,
});
