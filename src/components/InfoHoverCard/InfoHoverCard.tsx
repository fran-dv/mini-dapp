import { InfoCircledIcon } from "@radix-ui/react-icons";
import styles from "./InfoHoverCard.module.css";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useState } from "react";

interface Props {
  message: string;
  iconClassName?: string;
}

export const InfoHoverCard: React.FC<Props> = ({
  message,
  iconClassName,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={200}
      closeDelay={300}
    >
      <HoverCard.Trigger
        asChild
        className={styles.container}
        onClick={() => setOpen(!open)}
      >
        <InfoCircledIcon className={iconClassName} />
      </HoverCard.Trigger>
      <HoverCard.Portal container={document.body}>
        <HoverCard.Content className={styles.content} sideOffset={5} side="top">
          <p>{message}</p>
          <HoverCard.Arrow className={styles.arrow} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default InfoHoverCard;
