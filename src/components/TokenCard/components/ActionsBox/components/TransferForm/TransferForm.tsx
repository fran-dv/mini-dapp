import { z } from "zod";
import type { TokenConfig } from "@models/tokens";
import { ActionForm } from "@components/TokenCard/components/ActionsBox/components/ActionForm";
import useTransferToken from "@hooks/tokensActions/useTransferToken";

const TransferFormSchema = z.object({
  recipient: z
    .string({ error: "Please provide a recipient address" })
    .startsWith("0x", "The recipient address must start with 0x")
    .regex(
      /^(0x)?[0-9a-fA-F]{40}$/,
      "Please provide a valid standard ethereum address",
    ),
  amount: z
    .number({ error: "Please provide an amount" })
    .nonnegative("The amount must be positive"),
});

interface Props {
  token: TokenConfig;
  defaultValues?: Partial<z.infer<typeof TransferFormSchema>>;
}

export const TransferForm = ({ token, defaultValues }: Props) => {
  const { transfer, isPending } = useTransferToken();

  const transferCallback = (values: z.infer<typeof TransferFormSchema>) => {
    return transfer({
      token,
      recipient: values.recipient,
      amount: values.amount.toString(),
    });
  };

  return (
    <ActionForm
      actionName="transfer"
      schema={TransferFormSchema}
      fields={[
        {
          name: "recipient",
          label: "Recipient address",
          type: "text",
        },
        {
          name: "amount",
          label: "Amount to transfer",
          type: "number",
        },
      ]}
      actionCallback={transferCallback}
      isActionPending={isPending}
      buttonLabels={{
        default: "Transfer",
        pending: "Transferring...",
        confirming: "Waiting transaction...",
      }}
      defaultValues={defaultValues}
    />
  );
};

export default TransferForm;
