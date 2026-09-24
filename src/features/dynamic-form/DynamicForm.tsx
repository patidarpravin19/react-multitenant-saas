import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldValues } from "react-hook-form";
import type { FormFieldConfig, SelectOption } from "../../types/form";
import { Button } from "../../components/ui/Button";
import { getFieldComponent } from "./registry/fieldRegistry";
import { createDynamicFormSchema } from "./validation/schemaFactory";

interface DynamicFormProps {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  onSubmit: (values: FieldValues) => Promise<void> | void;
  initialValues?: FieldValues;
  submitLabel?: string;
  onCancel?: () => void;
}

function createDefaultValues(fields: FormFieldConfig[]): FieldValues {
  return Object.fromEntries(
    fields.map((field) => {
      if (field.defaultValue !== undefined)
        return [field.name, field.defaultValue];
      if (field.type === "checkbox" || field.type === "toggle")
        return [field.name, false];
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
  initialValues,
  submitLabel = "Submit",
  onCancel,
}: DynamicFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dependentOptions, setDependentOptions] = useState<
    Record<string, SelectOption[]>
  >({});
  const [loadingDependentOptions, setLoadingDependentOptions] = useState<
    Record<string, boolean>
  >({});

  const schema = useMemo(
    () =>
      createDynamicFormSchema(
        fields.map((field) =>
          field.type === "select" && field.loadOptions
            ? { ...field, options: dependentOptions[field.name] ?? [] }
            : field,
        ),
      ),
    [dependentOptions, fields],
  );
  const defaultValues = useMemo(
    () => ({ ...createDefaultValues(fields), ...initialValues }),
    [fields, initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const values = useWatch({ control });
  const previousValues = useRef(values);
  const dependencyKey = fields
    .filter((field) => field.type === "select" && field.dependsOn)
    .map((field) =>
      field.type === "select"
        ? `${field.name}:${String(values[field.dependsOn!] ?? "")}`
        : "",
    )
    .join("|");

  useEffect(() => {
    for (const field of fields) {
      if (field.type !== "select" || !field.dependsOn) continue;
      if (previousValues.current[field.dependsOn] !== values[field.dependsOn]) {
        setValue(field.name, "", { shouldValidate: true, shouldDirty: true });
      }
    }
    previousValues.current = values;
  }, [fields, setValue, values]);

  useEffect(() => {
    let cancelled = false;
    for (const field of fields) {
      if (field.type !== "select" || !field.dependsOn || !field.loadOptions)
        continue;
      const parentValue = String(getValues(field.dependsOn) ?? "");
      if (!parentValue) {
        setDependentOptions((current) => ({ ...current, [field.name]: [] }));
        setLoadingDependentOptions((current) => ({ ...current, [field.name]: false }));
        continue;
      }
      setLoadingDependentOptions((current) => ({ ...current, [field.name]: true }));
      void field.loadOptions(parentValue)
        .then((options) => {
          if (!cancelled)
            setDependentOptions((current) => ({ ...current, [field.name]: options }));
        })
        .catch(() => {
          if (!cancelled)
            setDependentOptions((current) => ({ ...current, [field.name]: [] }));
        })
        .finally(() => {
          if (!cancelled)
            setLoadingDependentOptions((current) => ({ ...current, [field.name]: false }));
        });
    }
    return () => {
      cancelled = true;
    };
  }, [dependencyKey, fields, getValues]);

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
        <div className="flex items-center justify-between gap-4">
          <h1
            id="dynamic-form-title"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            {title}
          </h1>
          {onCancel ? (
            <button
              type="button"
              aria-label="Back to list"
              title="Back to list"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={18} />
            </button>
          ) : null}
        </div>
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
            const renderedField =
              field.type === "select" && field.dependsOn
                ? {
                    ...field,
                    disabled:
                      field.disabled ||
                      !values[field.dependsOn] ||
                      loadingDependentOptions[field.name],
                    placeholder: !values[field.dependsOn]
                      ? "Select a vendor first"
                      : loadingDependentOptions[field.name]
                        ? "Loading options..."
                        : field.placeholder,
                    options: field.loadOptions
                      ? dependentOptions[field.name] ?? []
                      : values[field.dependsOn]
                        ? field.options.filter(
                            (option) =>
                              option.parentValue ===
                              String(values[field.dependsOn!]),
                          )
                        : [],
                  }
                : field;

            return (
              <div
                key={field.id}
                className={
                  field.colSpan === 2 ||
                    field.type === "checkbox" ||
                    field.type === "toggle"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <Component
                  field={renderedField}
                  register={register}
                  control={control}
                  errors={errors}
                />
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
            onClick={() =>
              onCancel
                ? onCancel()
                : (reset(defaultValues), setSubmitError(null))
            }
            disabled={isSubmitting}
          >
            {onCancel ? "Cancel" : "Reset"}
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}
