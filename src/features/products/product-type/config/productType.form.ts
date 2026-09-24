import type { FormFieldConfig } from "../../../../types/form";

interface ProductTypeFormOptions {
  vendors: {
    id: string;
    name: string;
  }[];
  loadBrands: (vendorId: string) => Promise<{ label: string; value: string }[]>;
}

export function createProductTypeFormConfig({
  vendors,
  loadBrands,
}: ProductTypeFormOptions): FormFieldConfig[] {
  return [
    {
      id: "vendorId",
      name: "vendorId",
      label: "Vendor",
      type: "select",
      required: true,
      options: vendors.map((vendor) => ({
        label: vendor.name,
        value: vendor.id,
      })),
    },
    {
      id: "brandId",
      name: "brandId",
      label: "Brand",
      type: "select",
      required: true,
      dependsOn: "vendorId",
      options: [],
      loadOptions: loadBrands,
    },
    {
      id: "name",
      name: "name",
      label: "Product Type",
      type: "text",
      required: true,
      placeholder: "Example: Mobile",
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      id: "isActive",
      name: "isActive",
      label: "Active",
      type: "toggle",
      defaultValue: true,
    },
  ];
}
