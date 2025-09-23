import useTokensStore from "@stores/tokens/useTokensStore";
import styles from "./Events.module.css";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { InfoHoverCard } from "@components/InfoHoverCard";
import { EventsTable } from "@components/EventsTable";
import { ReloadIcon } from "@radix-ui/react-icons";

export const Events: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { areEventsInitialized, areEventsLoading, loadEvents, tokensEvents } =
    useTokensStore();

  useEffect(() => {
    if (isConnected && address && !areEventsLoading && !areEventsInitialized) {
      loadEvents();
    }
  }, [
    isConnected,
    areEventsInitialized,
    areEventsLoading,
    loadEvents,
    address,
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Events history
          <InfoHoverCard
            iconClassName={styles.infoIcon}
            message="Showing events from the last ~10,000 blocks only."
          />
        </h1>

        {!isConnected ? (
          <p className={styles.connectWalletMessage}>
            Wallet disconnected :(
            <br />
            Please connect your wallet to see your events history.
          </p>
        ) : (
          <section className={styles.eventsTableContainer}>
            {!areEventsLoading && tokensEvents.length === 0 ? (
              <p className={styles.noEventsMessage}>No events found :(</p>
            ) : (
              <>
                <button
                  onClick={loadEvents}
                  title="Reload events"
                  aria-label="Reload events"
                  className={styles.reloadButton}
                >
                  <ReloadIcon
                    className={`${styles.reloadIcon} ${areEventsLoading ? styles.loading : ""}`}
                  />
                </button>
                <EventsTable
                  events={tokensEvents}
                  isLoading={areEventsLoading}
                />
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Events;
