import notFoundImage from "@assets/404.webp";
import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";
import Paths from "@routing/paths";

export const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={notFoundImage} alt="404" />
      <div className={styles.textContainer}>
        <p>
          You are more lost than the FIAT system. Return to{" "}
          <Link className={styles.link} to={Paths.Home}>
            wonderland
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
