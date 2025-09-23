import { z } from "zod";
import type { TokenConfig } from "@models/tokens";
import useApproveToken from "@hooks/tokensActions/useApproveToken";
import { ActionForm } from "@components/TokenCard/components/ActionsBox/components/ActionForm";
import useTokensStore from "@stores/tokens/useTokensStore";

const getApproveFormSchema = (walletBalance: number) =>
  z.object({
    spender: z
      .string({ error: "Please provide a spender address" })
      .startsWith("0x", "The spender address must start with 0x")
      .regex(
        /^(0x)?[0-9a-fA-F]{40}$/,
        "Please provide a valid standard ethereum address",
      ),
    amount: z
      .number({ error: "Please provide an amount" })
      .nonnegative("The amount must be positive")
      .refine((amount) => amount <= walletBalance, "Not enough funds"),
  });

interface Props {
  token: TokenConfig;
  defaultValues?: Partial<z.infer<ReturnType<typeof getApproveFormSchema>>>;
}

export const ApproveForm = ({ token, defaultValues }: Props) => {
  const { approve, isPending } = useApproveToken();
  const { tokensBalances } = useTokensStore();

  const approveCallback = (
    values: z.infer<ReturnType<typeof getApproveFormSchema>>,
  ) => {
    return approve({
      token,
      spender: values.spender,
      amount: values.amount.toString(),
    });
  };

  return (
    <ActionForm
      actionName="approve"
      schema={getApproveFormSchema(Number(tokensBalances[token.symbol]))}
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
