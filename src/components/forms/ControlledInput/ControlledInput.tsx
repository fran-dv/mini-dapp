import {
  useFormContext,
  Controller,
  type Path,
  type FieldValues,
} from "react-hook-form";
import styles from "./ControlledInput.module.css";

interface ControlledInputProps<T> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string | number | boolean) => void;
}

export const ControlledInput = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  className,
  onChange,
}: ControlledInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name];

  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...field}
            className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
            value={field.value ?? ""}
            onChange={(e) => {
              let value: string | number | boolean;
              if (type === "number") {
                value = e.target.value === "" ? "" : Number(e.target.value);
              } else if (type === "checkbox") {
                value = e.target.checked;
              } else {
                value = e.target.value;
              }
              field.onChange(value);
              if (onChange) onChange(value);
            }}
          />
        )}
      />
      <div className={styles.errorContainer}>
        {error && (
          <p id={`${name}-error`} role="alert" className={styles.error}>
            {error.message?.toString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ControlledInput;
