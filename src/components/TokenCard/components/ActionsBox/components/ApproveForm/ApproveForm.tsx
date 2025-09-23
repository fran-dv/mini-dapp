import { z } from "zod";
import type { TokenConfig } from "@models/tokens";
import useApproveToken from "@hooks/tokensActions/useApproveToken";
import { ActionForm } from "@components/TokenCard/components/ActionsBox/components/ActionForm";

const ApproveFormSchema = z.object({
  spender: z
    .string({ error: "Please provide a spender address" })
    .startsWith("0x", "The spender address must start with 0x")
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
  defaultValues?: Partial<z.infer<typeof ApproveFormSchema>>;
}

export const ApproveForm = ({ token, defaultValues }: Props) => {
  const { approve, isPending } = useApproveToken();

  const approveCallback = (values: z.infer<typeof ApproveFormSchema>) => {
    return approve({
      token,
      spender: values.spender,
      amount: values.amount.toString(),
    });
  };

  return (
    <ActionForm
      actionName="approve"
      schema={ApproveFormSchema}
      fields={[
        {
          name: "spender",
          label: "Spender address to approve",
          type: "text",
        },
        {
          name: "amount",
          label: "Amount to approve",
          type: "number",
        },
      ]}
      actionCallback={approveCallback}
      isActionPending={isPending}
      buttonLabels={{
        default: "Approve",
        pending: "Approving...",
        confirming: "Waiting transaction...",
      }}
      defaultValues={defaultValues}
    />
  );
};

export default ApproveForm;
