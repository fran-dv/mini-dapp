import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import styles from "./CustomForm.module.css";

interface Props<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

export const CustomForm = <T extends FieldValues>({
  methods,
  onSubmit,
  children,
  className = "",
  ...rest
}: Props<T>) => {
  return (
    <FormProvider {...methods}>
      <form
        {...rest}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${styles.form} ${className}`}
      >
        {children}
      </form>
    </FormProvider>
  );
};
