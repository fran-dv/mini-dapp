import { z } from "zod";
import type { TokenConfig } from "@models/tokens";
import { ActionForm } from "@components/TokenCard/components/ActionsBox/components/ActionForm";
import useMintToken from "@hooks/tokensActions/useMintToken";

const MintFormSchema = z.object({
  amount: z
    .number({ error: "Please provide an amount" })
    .nonnegative("The amount must be positive")
    .min(0.1, "The amount can't be less than 0.1")
    .max(999, "isn't that too much? 🧐"),
});

interface Props {
  token: TokenConfig;
  defaultValues?: Partial<z.infer<typeof MintFormSchema>>;
}

export const MintForm = ({ token, defaultValues }: Props) => {
  const { mint, isPending: isMintPending } = useMintToken();

  const mintCallback = (values: z.infer<typeof MintFormSchema>) => {
    return mint({ token, amount: values.amount.toString() });
  };
  return (
    <ActionForm
      actionName="mint"
      schema={MintFormSchema}
      fields={[
        {
          name: "amount",
          label: "Amount to mint",
          type: "number",
        },
      ]}
      buttonLabels={{
        pending: "Minting...",
        confirming: "Waiting transaction...",
        default: "Mint",
      }}
      actionCallback={mintCallback}
      isActionPending={isMintPending}
      defaultValues={defaultValues}
    />
  );
};

export default MintForm;
