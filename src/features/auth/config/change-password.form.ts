import type { FormFieldConfig } from "../../../types/form";

export const changePasswordFields: FormFieldConfig[] = [
  {
    id: "current-password",
    name: "currentPassword",
    label: "Current password",
    type: "password",
    autoComplete: "current-password",
    required: true,
  },
  {
    id: "new-password",
    name: "newPassword",
    label: "New password",
    type: "password",
    autoComplete: "new-password",
    description: "At least 8 characters, with uppercase, lowercase, and a number.",
    required: true,
  },
  {
    id: "confirm-password",
    name: "confirmPassword",
    label: "Confirm new password",
    type: "password",
    autoComplete: "new-password",
    required: true,
  },
];
