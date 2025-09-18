import { SEPOLIA_CHAIN_ID } from "@config/tokens";
import { useAccount, useSwitchChain } from "wagmi";
import styles from "./WrongChainBanner.module.css";
import { supportedChains } from "@/config/wagmi.config";

export const WrongChainBanner: React.FC = () => {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const isWrongChain =
    isConnected && !supportedChains.find((chain) => chain.id === chainId);

  if (!isWrongChain) {
    return null;
  }

  const handleSwitchChain = () => {
    switchChain({ chainId: SEPOLIA_CHAIN_ID });
  };

  return (
    <div className={styles.container}>
      <p>Wrong network — please switch to Sepolia to use this app.</p>
      <button
        className={styles.switchButton}
        onClick={handleSwitchChain}
        disabled={isPending}
      >
        {isPending ? "Switching..." : "Switch chain"}
      </button>
    </div>
  );
};

export default WrongChainBanner;
