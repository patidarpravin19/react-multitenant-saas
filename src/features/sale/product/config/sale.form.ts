import type { FormFieldConfig, SelectOption } from "../../../../types/form";
import type { SaleProductOption } from "../types/sale.types";

export function createSaleFormConfig(
  products: SaleProductOption[],
): FormFieldConfig[] {
  const options: SelectOption[] = products.map((product) => {
    const serial = product.serialNumber || product.serialNumber1;
    return {
      value: product.id,
      label: serial ? `${product.brand} - ${product.productModel} - ${product.variant} - ${product.color} — ${serial}` : product.brand,
    };
  });

  return [
    {
      id: "productId",
      name: "productId",
      label: "Product (name or serial number)",
      type: "select",
      required: true,
      options,
      placeholder: "Search product name or serial number",
      colSpan: "full",
    },
    {
      id: "customerName",
      name: "customerName",
      label: "Customer Name",
      type: "text",
      required: true,
    },
    {
      id: "customerMobile",
      name: "customerMobile",
      label: "Mobile Number",
      type: "tel",
      required: true,
    },
    {
      id: "customerAddress",
      name: "customerAddress",
      label: "Address",
      type: "textarea",
      required: true,
      colSpan: "full",
    },
    {
      id: "saleDate",
      name: "saleDate",
      label: "Sale Date",
      type: "date",
      required: true,
      defaultValue: new Date().toISOString().slice(0, 10),
    },
    {
      id: "productPrice",
      name: "productPrice",
      label: "Product Price",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
      readOnly: true,
      computed: {
        calculate: (values) => {
          const product = products.find(
            (item) => item.id === String(values.productId ?? ""),
          );
          return product?.purchasePrice ?? product?.sellingPrice ?? 0;
        },
      },
    },
    {
      id: "sellingPrice",
      name: "sellingPrice",
      label: "Selling Price",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      id: "discount",
      name: "discount",
      label: "Discount",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
      defaultValue: 0,
    },
  ];
}
