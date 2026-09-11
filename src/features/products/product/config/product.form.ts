import type { FormFieldConfig } from "../../../../types/form";

interface ProductFormOptions {
  vendors: { id: string; name: string }[];
  productTypes: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  variants: { id: string; name: string }[];
}

export function createProductFormConfig({ vendors, productTypes, categories, variants }: ProductFormOptions): FormFieldConfig[] {
  const optionFields = [
    ["vendorId", "Vendor", vendors],
    ["productTypeId", "Product Type", productTypes],
    ["categoryId", "Category", categories],
    ["variantId", "Variant", variants],
  ] as const;
  return [
    ...optionFields.map(([name, label, options]) => ({ id: name, name, label, type: "select" as const, required: true, options: options.map(option => ({ label: option.name, value: option.id })) })),
    { id: "code", name: "code", label: "Product Code", type: "text", required: true },
    { id: "emi", name: "emi", label: "Unique Number", type: "text", required: true },
    { id: "uniqueNumber1", name: "uniqueNumber1", label: "Secondary Unique Number", type: "text" },
    { id: "serialNumber", name: "serialNumber", label: "Serial Number", type: "text", required: true },
    { id: "quantity", name: "quantity", label: "Quantity", type: "number", required: true, min: 0 },
    { id: "purchasePrice", name: "purchasePrice", label: "Purchase Price", type: "number", required: true, min: 0 },
    { id: "discount", name: "discount", label: "Discount", type: "number", min: 0 },
    { id: "tax", name: "tax", label: "Tax (%)", type: "number", min: 0 },
    { id: "description", name: "description", label: "Description", type: "textarea" },
    { id: "isActive", name: "isActive", label: "Active", type: "toggle", defaultValue: true },
  ];
}
