import { APP_ROUTES } from "../../../../config/routes";
import { createResourceApi } from "../../../shared/resourceApi";
import { saleColumns } from "../config/sale.columns";
import { createSaleFormConfig } from "../config/sale.form";
import type { SaleProductOption, SaleRecord } from "../types/sale.types";

const salesApi = createResourceApi<SaleRecord>("/sales/products");

export const saleResource = {
  title: "Product Sales",
  description: "Record sold products and customer details.",
  singular: "Sale",
  listPath: APP_ROUTES.sale.products.list,
  addPath: APP_ROUTES.sale.products.add,
  editPath: APP_ROUTES.sale.products.edit,
  columns: saleColumns,
  columnsPerRow: 2 as const,
  loadFields: async () =>
    createSaleFormConfig(
      await createResourceApi<SaleProductOption>("/products/all").list(),
    ),
  api: salesApi,
};
