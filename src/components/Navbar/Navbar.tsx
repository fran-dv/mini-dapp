import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { Paths } from "@routing/paths";
import useTokensStore from "@stores/tokens/useTokensStore";

export const Navbar: React.FC = () => {
  const { isFormActionPending } = useTokensStore();
  return (
    <header className={styles.wrapper}>
      <nav className={styles.container}>
        <div className={styles.navLinks}>
          <button className={styles.linkButton} disabled={isFormActionPending}>
            {isFormActionPending ? (
              <p className={styles.link}>Home</p>
            ) : (
              <Link
                className={styles.link}
                to={Paths.Home}
                aria-disabled={isFormActionPending}
              >
                Home
              </Link>
            )}
          </button>

          <button className={styles.linkButton} disabled={isFormActionPending}>
            {isFormActionPending ? (
              <p className={styles.link}>Events</p>
            ) : (
              <Link
                className={styles.link}
                to={Paths.Events}
                aria-disabled={isFormActionPending}
              >
                Events
              </Link>
            )}
          </button>
        </div>
        <ConnectButton showBalance={false} />
      </nav>
    </header>
  );
};

export default Navbar;
