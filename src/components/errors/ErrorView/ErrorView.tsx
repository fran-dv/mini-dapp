import styles from "./ErrorView.module.css";

export const ErrorView = () => {
  return (
    <div className={styles.container}>
      <h1>An error has occurred 🚩</h1>
      <p>
        It seems that something didn&apos;t go as expected. Sorry for that.
        Please try reloading the page, or contact the support team.
        <br />
        <br />
        *Actually, there&apos;s no support team to contact, what did you expect?
        But you can check the error details in the console.
      </p>
    </div>
  );
};

export default ErrorView;
