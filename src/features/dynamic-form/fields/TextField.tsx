import { FormFieldShell } from "../../../components/ui/FormFieldShell";
import type { DynamicFieldProps } from "./fieldTypes";

export function TextField({ field, register, errors }: DynamicFieldProps) {
  if (field.type !== "text") return null;

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
      <input
        id={field.id}
        type="text"
        placeholder={field.placeholder}
        disabled={field.disabled}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? `${field.id}-error` : undefined}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-[var(--tenant-primary)] focus:ring-2 focus:ring-[var(--tenant-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        {...register(field.name)}
      />
    </FormFieldShell>
  );
}
