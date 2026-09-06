import { FormFieldShell } from "../../../components/ui/FormFieldShell";
import type { DynamicFieldProps } from "./fieldTypes";

export function SelectField({ field, register, errors }: DynamicFieldProps) {
  if (field.type !== "select") return null;

  const error = errors[field.name]?.message;
  const message = typeof error === "string" ? error : undefined;

  return (
    <FormFieldShell
      id={field.id}
      label={field.label}
      description={field.description}
      error={message}
      required={field.required}
    >
      <select
        id={field.id}
        disabled={field.disabled}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? `${field.id}-error` : undefined}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-300 hover:border-slate-400 focus:border-[var(--tenant-primary)] focus:ring-2 focus:ring-[var(--tenant-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        {...register(field.name)}
      >
        <option value="">{field.placeholder ?? "Select an option"}</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormFieldShell>
  );
}
