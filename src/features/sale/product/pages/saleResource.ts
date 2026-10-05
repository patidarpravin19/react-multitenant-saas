import { APP_ROUTES } from "../../../../config/routes";
import { createResourceApi } from "../../../shared/resourceApi";
import { saleColumns } from "../config/sale.columns";
import { createSaleFormConfig } from "../config/sale.form";
import type { SaleProductOption, SaleRecord } from "../types/sale.types";

const productsApi = createResourceApi<SaleProductOption>("/products/all");
const salesApi = createResourceApi<SaleRecord>("/sales/products");

async function addProductDetails(values: Record<string, unknown>) {
  const products = await productsApi.list();
  const product = products.find(
    (item) => item.id === String(values.productId ?? ""),
  );
  return {
    ...values,
    // productName: product?.name ?? "",
    // serialNumber: product?.serialNumber ?? product?.serialNumber1 ?? "",
    // productPrice: product?.purchasePrice ?? product?.sellingPrice ?? 0,
  };
}

export const saleResource = {
  title: "Product Sales",
  description: "Record sold products and customer details.",
  singular: "Sale",
  listPath: APP_ROUTES.sale.products.list,
  addPath: APP_ROUTES.sale.products.add,
  editPath: APP_ROUTES.sale.products.edit,
  columns: saleColumns,
  columnsPerRow: 2 as const,
  loadFields: async () => createSaleFormConfig(await productsApi.list()),
  api: {
    ...salesApi,
    create: async (values: Record<string, unknown>) =>
      salesApi.create(await addProductDetails(values)),
    update: async (id: string, values: Record<string, unknown>) =>
      salesApi.update(id, await addProductDetails(values)),
  },
};
