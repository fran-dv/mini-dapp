import {
  FormProvider,
  useForm,
  type DefaultValues,
  type SubmitHandler,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z, ZodType } from "zod";
import styles from "./CustomForm.module.css";

interface Props<
  TSchema extends z.ZodTypeAny,
  TInput extends FieldValues,
  TOutput = z.output<TSchema>,
> {
  schema: TSchema;
  onSubmit: SubmitHandler<TOutput>;
  defaultValues?: DefaultValues<TInput>;
  children: React.ReactNode;
  className?: string;
}

export const CustomForm = <
  TSchema extends z.ZodTypeAny,
  TInput extends FieldValues,
  TOutput = z.output<TSchema>,
>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className = "",
}: Props<TSchema, TInput, TOutput>) => {
  const methods = useForm<TInput, unknown, TOutput>({
    resolver: zodResolver(schema as ZodType<TOutput, TInput>),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${styles.form} ${className}`}
      >
        {children}
      </form>
    </FormProvider>
  );
};
