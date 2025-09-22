import styles from "./SubmitButton.module.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const SubmitButton: React.FC<Props> = ({
  children,
  className,
  isLoading,
  ...rest
}: Props) => {
  return (
    <button type="submit" className={`${styles.button} ${className}`} {...rest}>
      {!isLoading ? (
        children
      ) : (
        <div className={styles.loadingContainer}>
          <svg
            className={styles.svg}
            version="1.1"
            id="L9"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 0 0"
            xmlSpace="preserve"
          >
            <path
              fill="#fff"
              d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="1s"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          {children}
        </div>
      )}
    </button>
  );
};

export default SubmitButton;
