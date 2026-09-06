import type { ComponentType } from "react";
import type { FieldType } from "../../../types/form";
import type { DynamicFieldProps } from "../fields/fieldTypes";
import { TextField } from "../fields/TextField";
import { EmailField } from "../fields/EmailField";
import { SelectField } from "../fields/SelectField";
import { CheckboxField } from "../fields/CheckboxField";

export type FieldComponent = ComponentType<DynamicFieldProps>;

const registry: Record<FieldType, FieldComponent> = {
  text: TextField,
  email: EmailField,
  select: SelectField,
  checkbox: CheckboxField,
};

export function getFieldComponent(type: FieldType): FieldComponent {
  return registry[type];
}
