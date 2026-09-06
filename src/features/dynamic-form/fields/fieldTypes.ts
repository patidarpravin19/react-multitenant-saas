import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import type { FormFieldConfig } from "../../../types/form";

export interface DynamicFieldProps {
  field: FormFieldConfig;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}
