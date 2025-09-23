import React, { useState } from "react";
import styles from "./Address.module.css";
import useUserMessages from "@/hooks/useUserMessages";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

interface Props {
  value: `0x${string}`;
  chars?: number;
}

export const Address: React.FC<Props> = ({ value, chars = 4 }) => {
  const [copied, setCopied] = useState(false);
  const { showSuccess, showError } = useUserMessages();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      showSuccess("Address copied to clipboard");
    } catch (err) {
      console.error("Failed to copy address:", err);
      showError("Failed to copy address");
    }
  };

  if (!value) return null;

  const display = `${value.slice(0, chars + 2)}...${value.slice(-chars)}`;

  return (
    <button
      className={styles.button}
      onClick={handleCopy}
      title="Click to copy"
      aria-label="Copy address"
    >
      {display}{" "}
      {copied ? (
        <CheckIcon className={styles.copyIcon} />
      ) : (
        <CopyIcon className={styles.copyIcon} />
      )}
    </button>
  );
};

export default Address;
