import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { Paths } from "@routing/paths";

export const Navbar: React.FC = () => {
  return (
    <header className={styles.wrapper}>
      <nav className={styles.container}>
        <div className={styles.navLinks}>
          <button className={styles.linkButton}>
            <Link className={styles.link} to={Paths.Home}>
              Home
            </Link>
          </button>
        </div>
        <ConnectButton showBalance={false} />
      </nav>
    </header>
  );
};

export default Navbar;
