import { CustomForm } from "@components/forms/CustomForm";
import { z, ZodObject } from "zod";
import { ControlledInput } from "@components/forms/ControlledInput";
import { SubmitButton } from "@components/forms/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTokensStore from "@stores/tokens/useTokensStore";
import { useCallback, useEffect, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import useUserMessages from "@hooks/useUserMessages";

export interface ActionFormField {
  name: string;
  label: string;
  type: string;
}

export interface ActionFormButtonLabels {
  pending: string;
  confirming: string;
  default: string;
}

interface Props<T> {
  actionName: string;
  schema: ZodObject;
  fields: ActionFormField[];
  buttonLabels: ActionFormButtonLabels;
  actionCallback: (values: T) => Promise<`0x${string}` | undefined>;
  isActionPending: boolean;
  defaultValues?: Partial<T>;
}

export const ActionForm = <T,>({
  actionName,
  schema,
  fields,
  buttonLabels,
  actionCallback,
  isActionPending,
  defaultValues,
}: Props<T>) => {
  const methods = useForm<z.infer<typeof schema>>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { setValue } = methods;
  const { showError, showSuccess } = useUserMessages();
  const { refreshBalances, startFormAction, finishFormAction } =
    useTokensStore();
  const [txHash, setTxHash] = useState<string | null>(null);

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const reset = useCallback(() => {
    fields.forEach((f) => {
      setValue(f.name, defaultValues?.[f.name as keyof T] ?? "");
    });
    finishFormAction();
  }, [finishFormAction, setValue, fields, defaultValues]);

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    startFormAction();
    const hash = await actionCallback(values as T);
    if (!hash) {
      finishFormAction();
      return;
    }
    setTxHash(hash);
  };

  useEffect(() => {
    if (isConfirmed) {
      refreshBalances();
      setTxHash(null);
      reset();
      showSuccess(`${actionName} transaction confirmed`);
    }

    if (txError) {
      console.error("Transaction error:", txError);
      showError(`There was an error in the ${actionName} transaction`);
      setTxHash(null);
      finishFormAction();
    }
  }, [
    refreshBalances,
    reset,
    isConfirmed,
    txError,
    showError,
    actionName,
    finishFormAction,
    showSuccess,
  ]);

  return (
    <CustomForm onSubmit={handleSubmit} methods={methods}>
      {fields.map((f) => (
        <div key={f.name}>
          <ControlledInput name={f.name} label={f.label} type={f.type} />
        </div>
      ))}

      <SubmitButton
        disabled={isActionPending || isConfirming}
        isLoading={isActionPending || isConfirming}
      >
        {isActionPending
          ? buttonLabels?.pending
          : isConfirming
            ? buttonLabels?.confirming
            : buttonLabels?.default}
      </SubmitButton>
    </CustomForm>
  );
};

export default ActionForm;
