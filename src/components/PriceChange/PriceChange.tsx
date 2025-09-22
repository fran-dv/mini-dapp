import styles from "./PriceChange.module.css";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";

interface Props {
  priceChange: number;
}

export const PriceChange: React.FC<Props> = ({ priceChange }: Props) => {
  const formattedChangePercentage = (
    Math.trunc(priceChange * 100) / 100
  ).toFixed(2);
  return (
    <div className={styles.container}>
      {priceChange > 0 ? (
        <TriangleUpIcon className={`${styles.triangleIcon} ${styles.up}`} />
      ) : (
        <TriangleDownIcon className={`${styles.triangleIcon} ${styles.down}`} />
      )}
      <p
        className={`${styles.changePercentage} ${priceChange > 0 ? styles.up : styles.down}`}
      >
        {formattedChangePercentage}%
      </p>
    </div>
  );
};

export default PriceChange;
