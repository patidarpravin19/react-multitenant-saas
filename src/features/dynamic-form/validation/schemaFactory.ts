import { z } from "zod";
import type { FormFieldConfig } from "../../../types/form";

function requiredMessage(label: string): string {
  return `${label} is required.`;
}

function textSchema(field: Extract<FormFieldConfig, { type: "text" }>) {
  let schema = z.string();

  if (field.required) schema = schema.min(1, requiredMessage(field.label));
  if (field.minLength)
    schema = schema.min(
      field.minLength,
      `${field.label} must contain at least ${field.minLength} characters.`,
    );
  if (field.maxLength)
    schema = schema.max(
      field.maxLength,
      `${field.label} must contain at most ${field.maxLength} characters.`,
    );

  return field.required ? schema : schema.optional().or(z.literal(""));
}

function emailSchema(field: Extract<FormFieldConfig, { type: "email" }>) {
  const base = z.string();

  if (field.required) {
    return base
      .min(1, requiredMessage(field.label))
      .email("Enter a valid email address.");
  }

  return z.union([z.literal(""), base.email("Enter a valid email address.")]).optional();
}

function selectSchema(field: Extract<FormFieldConfig, { type: "select" }>) {
  const allowedValues = new Set(field.options.map((option) => option.value));

  const base = z
    .string()
    .refine(
      (value) => value === "" || allowedValues.has(value),
      `${field.label} contains an invalid selection.`,
    );

  return field.required
    ? base.refine((value) => value !== "", requiredMessage(field.label))
    : base.optional();
}

function checkboxSchema(field: Extract<FormFieldConfig, { type: "checkbox" }>) {
  return field.required
    ? z.literal(true, { error: `${field.label} must be accepted.` })
    : z.boolean();
}

export function createDynamicFormSchema(fields: FormFieldConfig[]) {
  const shape: Record<string, z.ZodType> = {};

  for (const field of fields) {
    switch (field.type) {
      case "text":
        shape[field.name] = textSchema(field);
        break;
      case "email":
        shape[field.name] = emailSchema(field);
        break;
      case "select":
        shape[field.name] = selectSchema(field);
        break;
      case "checkbox":
        shape[field.name] = checkboxSchema(field);
        break;
    }
  }

  return z.object(shape);
}
