export type FieldType = "text" | "email" | "select" | "checkbox";

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseFieldConfig {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface EmailFieldConfig extends BaseFieldConfig {
  type: "email";
  placeholder?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  placeholder?: string;
  options: SelectOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
}

export type FormFieldConfig =
  | TextFieldConfig
  | EmailFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig;

export type DynamicFormValues = Record<string, unknown>;
