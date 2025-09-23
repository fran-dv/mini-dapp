import styles from "./Home.module.css";
import { TokenCard } from "@components/TokenCard";
import { Tokens } from "@config/tokens";
import { useAccount } from "wagmi";
import useTokenMarketData from "@hooks/useTokenMarketData";
import type { TokenMarketData } from "@models/tokens";
import useTokensStore from "@stores/tokens/useTokensStore";

const tokens = Object.values(Tokens);

export const Home: React.FC = () => {
  const { isConnected } = useAccount();
  const { data: tokensMarketData, isLoading } = useTokenMarketData({
    coinGeckoIds: tokens.map((token) => token.coinGeckoId),
  });

  const { tokensBalances, areBalancesLoading } = useTokensStore();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your tokens</h1>

        {!isConnected ? (
          <p className={styles.connectWalletMessage}>
            Wallet disconnected :(
            <br />
            Please connect your wallet to see your tokens.
          </p>
        ) : (
          <section className={styles.tokenListContainer}>
            {tokens.map((token) => {
              return (
                <TokenCard
                  key={token.symbol}
                  token={token}
                  tokenMarketData={
                    tokensMarketData?.find(
                      (marketData) =>
                        marketData.coinGeckoId === token.coinGeckoId,
                    ) as TokenMarketData
                  }
                  balance={tokensBalances[token.symbol]}
                  isLoading={isLoading || areBalancesLoading}
                />
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
