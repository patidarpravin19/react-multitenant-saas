import type { FormFieldConfig } from "../../../../types/form";

interface ProductTypeFormOptions {
  vendors: {
    id: string;
    name: string;
  }[];
  brands: {
    id: string;
    name: string;
  }[];
}

export function createProductTypeFormConfig({
  vendors,
  brands,
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
      options: brands.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })),
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
      id: "code",
      name: "code",
      label: "Code",
      type: "text",
      required: true,
      placeholder: "Example: MOBILE",
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
