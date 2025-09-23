import type { TokenConfig, TokenMarketData } from "@models/tokens";
import styles from "./TokenCard.module.css";
import { PriceChange } from "@components/PriceChange";
import { ActionsBox } from "./components/ActionsBox";
import { InfoHoverCard } from "./components/InfoHoverCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
  token: TokenConfig;
  tokenMarketData: TokenMarketData;
  balance: string;
  isLoading?: boolean;
}

export const TokenCard: React.FC<Props> = ({
  token,
  tokenMarketData,
  balance,
  isLoading = false,
}: Props) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.infoWrapper}>
            <div className={styles.logoCircle}>
              <Skeleton height="100%" width="100%" circle />
            </div>

            <div className={styles.info}>
              <h4 className={styles.name}>
                <Skeleton width={"6rem"} height={"1.25rem"} />
              </h4>
              <p className={styles.symbol}>
                <Skeleton width={"4rem"} height={"1rem"} />
              </p>
            </div>
          </div>

          <div className={styles.walletInfo}>
            <h4 className={styles.balance}>
              <Skeleton width={"6rem"} height={"1.25rem"} />
            </h4>
            <div className={styles.marketData}>
              <p className={styles.price}>
                <Skeleton width={"8rem"} height={"1rem"} />
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actionsBoxWrapper}>
          <ActionsBox isLoading token={{} as TokenConfig} />
        </div>
      </div>
    );
  }

  const balanceInUSD = tokenMarketData.price * parseFloat(balance);
  const formattedPrice: string = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 8,
  }).format(Math.floor(balanceInUSD * 100) / 100);

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.infoWrapper}>
          <div className={styles.logoCircle}>
            <img src={token.logo} alt={token.name} />
          </div>
          <div className={styles.info}>
            <h4 className={styles.name}>{token.name}</h4>
            <p
              className={styles.symbol}
              title={`Symbol: ${token.symbol}`}
              aria-label={`Symbol: ${token.symbol}`}
            >
              {token.symbol}
            </p>
          </div>
        </div>

        <div className={styles.walletInfo}>
          <p className={styles.balanceLabel}>
            Balance{" "}
            <InfoHoverCard
              iconClassName={styles.infoIcon}
              message={`Testnet ${token.symbol} — no real value. USD price based on mainnet data for demonstration purposes only.`}
            />
          </p>
          <h4
            className={styles.balance}
            title={`Balance: ${balance}`}
            aria-label={`Balance: ${balance}`}
          >
            {balance}
          </h4>
          <div className={styles.marketData}>
            <p
              className={styles.price}
              title={`Price: ${formattedPrice}`}
              aria-label={`Price: ${formattedPrice}`}
            >
              USD {formattedPrice}
            </p>
            <PriceChange priceChange={tokenMarketData.priceChange24h} />
          </div>
        </div>
      </div>

      <div className={styles.actionsBoxWrapper}>
        <ActionsBox isLoading={isLoading} token={token} />
      </div>
    </div>
  );
};

export default TokenCard;
