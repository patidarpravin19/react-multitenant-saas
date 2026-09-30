import type { FormFieldConfig } from "../../../../types/form";

export const gstFormConfig: FormFieldConfig[] = [
  {
    id: "cgst",
    name: "cgst",
    label: "CGST (%)",
    type: "number",
    required: true,
    min: 0,
    max: 100,
    step: 0.01,
    defaultValue: 0,
  },
  {
    id: "sgst",
    name: "sgst",
    label: "SGST (%)",
    type: "number",
    required: true,
    min: 0,
    max: 100,
    step: 0.01,
    defaultValue: 0,
  },
  {
    id: "totalGst",
    name: "totalGst",
    label: "Total GST (%)",
    type: "number",
    readOnly: true,
    defaultValue: 0,
    description: "Calculated automatically as CGST + SGST.",
    computed: {
      calculate: (values) => Number(values.cgst ?? 0) + Number(values.sgst ?? 0),
    },
  },
  {
    id: "isActive",
    name: "isActive",
    label: "Active",
    type: "toggle",
    defaultValue: true,
  },
];
