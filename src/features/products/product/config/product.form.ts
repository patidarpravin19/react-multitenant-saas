import type { FormFieldConfig, SelectOption } from "../../../../types/form";

export interface ProductLookup {
  id: string;
  name: string;
  brandId?: string;
  productTypeId?: string;
}

interface ProductFormOptions {
  vendors: ProductLookup[];
  brands: ProductLookup[];
  productTypes: ProductLookup[];
  models: ProductLookup[];
  variants: ProductLookup[];
  colors: ProductLookup[];
}

const toOptions = (items: ProductLookup[]): SelectOption[] =>
  items.map(({ id, name }) => ({ label: name, value: id }));

export function createProductFormConfig({
  vendors,
  brands,
  productTypes,
  models,
  variants,
  colors,
}: ProductFormOptions): FormFieldConfig[] {
  return [
    { id: "vendorId", name: "vendorId", label: "Vendor", type: "select", required: true, options: toOptions(vendors) },
    { id: "brandId", name: "brandId", label: "Brand", type: "select", required: true, options: toOptions(brands) },
    {
      id: "productTypeId", name: "productTypeId", label: "Product Type", type: "select", required: true,
      dependsOn: "brandId", placeholder: "Select a brand first",
      options: productTypes.map((item) => ({ label: item.name, value: item.id, parentValue: item.brandId })),
      loadOptions: async (brandId) => toOptions(productTypes.filter((item) => !item.brandId || item.brandId === brandId)),
    },
    {
      id: "productModelId", name: "productModelId", label: "Model", type: "select", required: true,
      dependsOn: "productTypeId", placeholder: "Select a product type first",
      options: models.map((item) => ({ label: item.name, value: item.id, parentValue: item.productTypeId })),
      loadOptions: async (productTypeId) => toOptions(models.filter((item) => !item.productTypeId || item.productTypeId === productTypeId)),
    },
    { id: "variantId", name: "variantId", label: "Variant", type: "select", required: true, options: toOptions(variants) },
    { id: "colorId", name: "colorId", label: "Color", type: "select", required: true, options: toOptions(colors) },
    { id: "serialNumber", name: "serialNumber", label: "Serial Number", type: "text", required: true },
    { id: "serialNumber1", name: "serialNumber1", label: "Serial Number 1", type: "text" },
    { id: "quantity", name: "quantity", label: "Quantity", type: "number", required: true, min: 1, step: 1, defaultValue: 1 },
    { id: "purchasePrice", name: "purchasePrice", label: "Purchase Price", type: "number", required: true, min: 0, step: 0.01 },
    { id: "discount", name: "discount", label: "Discount", type: "number", min: 0, step: 0.01 },
    { id: "cgst", name: "cgst", label: "CGST (%)", type: "number", min: 0, step: 0.01 },
    { id: "sgst", name: "sgst", label: "SGST (%)", type: "number", min: 0, step: 0.01 },
    { id: "tax", name: "tax", label: "Tax (%)", type: "number", min: 0, step: 0.01 },
  ];
}
