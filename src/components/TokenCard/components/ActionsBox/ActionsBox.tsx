import styles from "./ActionsBox.module.css";
import * as Tabs from "@radix-ui/react-tabs";
import { TransferForm } from "./components/TransferForm";
import { ApproveForm } from "./components/ApproveForm";
import { MintForm } from "./components/MintForm";
import type { TokenConfig } from "@models/tokens";
import useTokensStore from "@stores/tokens/useTokensStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
  isLoading?: boolean;
  token: TokenConfig;
}

export const ActionsBox: React.FC<Props> = ({
  isLoading = false,
  token,
}: Props) => {
  const { isFormActionPending } = useTokensStore();

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.list}>
          <div className={styles.trigger}>
            <Skeleton width={"4rem"} borderRadius={"var(--border-radius)"} />
          </div>
          <div className={styles.trigger}>
            <Skeleton width={"4rem"} borderRadius={"var(--border-radius)"} />
          </div>
          <div className={styles.trigger}>
            <Skeleton width={"4rem"} borderRadius={"var(--border-radius)"} />
          </div>
        </div>
        <div className={`${styles.content} ${styles.skeleton}`}>
          <Skeleton height={"2rem"} borderRadius={"var(--border-radius-lg)"} />
          <Skeleton height={"2rem"} borderRadius={"var(--border-radius-lg)"} />
        </div>
      </div>
    );
  }
  return (
    <Tabs.Root className={styles.root} defaultValue="tab1">
      <Tabs.List className={styles.list}>
        <Tabs.Trigger
          className={styles.trigger}
          value="tab1"
          disabled={isFormActionPending}
        >
          Mint
        </Tabs.Trigger>
        <Tabs.Trigger
          className={styles.trigger}
          value="tab2"
          disabled={isFormActionPending}
        >
          Transfer
        </Tabs.Trigger>
        <Tabs.Trigger
          className={styles.trigger}
          value="tab3"
          disabled={isFormActionPending}
        >
          Approve
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className={styles.content} value="tab1">
        <MintForm token={token} />
      </Tabs.Content>
      <Tabs.Content className={styles.content} value="tab2">
        <TransferForm token={token} />
      </Tabs.Content>
      <Tabs.Content className={styles.content} value="tab3">
        <ApproveForm token={token} />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default ActionsBox;
