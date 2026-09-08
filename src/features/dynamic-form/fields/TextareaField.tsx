import { FormFieldShell } from "../../../components/ui/FormFieldShell";
import { inputClass } from "../../../components/ui/inputClass";
import type { DynamicFieldProps } from "../../../types/form";

export function TextareaField({ field, register, errors }: DynamicFieldProps) {
  if (field.type !== "textarea") return null;
  const message = typeof errors[field.name]?.message === "string" ? String(errors[field.name]?.message) : undefined;
  return <FormFieldShell id={field.id} label={field.label} description={field.description} error={message} required={field.required}>
    <textarea id={field.id} rows={field.rows ?? 4} placeholder={field.placeholder} disabled={field.disabled}
      className={`${inputClass} resize-y`} {...register(field.name)} />
  </FormFieldShell>;
}
