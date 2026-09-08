import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";
import type { FormFieldConfig } from "../../types/form";
import { Button } from "../../components/ui/Button";
import { getFieldComponent } from "./registry/fieldRegistry";
import { createDynamicFormSchema } from "./validation/schemaFactory";

interface DynamicFormProps {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  onSubmit: (values: FieldValues) => Promise<void> | void;
}

function createDefaultValues(fields: FormFieldConfig[]): FieldValues {
  return Object.fromEntries(
    fields.map((field) => {
      if (field.defaultValue !== undefined) return [field.name, field.defaultValue];
      if (field.type === "checkbox" || field.type === "toggle") return [field.name, false];
      if (field.type === "multiSelect") return [field.name, []];
      return [field.name, ""];
    }),
  );
}

export function DynamicForm({
  title,
  description,
  fields,
  onSubmit,
}: DynamicFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(() => createDynamicFormSchema(fields), [fields]);
  const defaultValues = useMemo(() => createDefaultValues(fields), [fields]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The form could not be submitted. Please try again.",
      );
    }
  });

  return (
    <section
      aria-labelledby="dynamic-form-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-6 border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1
          id="dynamic-form-title"
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {fields.map((field) => {
            const Component = getFieldComponent(field.type);

            return (
              <div
                key={field.id}
                className={field.colSpan === 2 || field.type === "checkbox" || field.type === "toggle" ? "md:col-span-2" : ""}
              >
                <Component field={field} register={register} control={control} errors={errors} />
              </div>
            );
          })}
        </div>

        {submitError ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset(defaultValues);
              setSubmitError(null);
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </section>
  );
}
