import { APP_ROUTES } from "../../../../config/routes";
import { createResourceApi } from "../../../shared/resourceApi";
import { apiClient } from "../../../../services/apiClient";
import { saleColumns } from "../config/sale.columns";
import { createSaleFormConfig, type SaleTaxOption } from "../config/sale.form";
import type { CustomerLookupRecord, SaleProductOption, SaleRecord } from "../types/sale.types";

const salesApi = createResourceApi<SaleRecord>("/sales/products");

export const saleResource = {
  title: "Product Sales",
  auditTableName: "sales_products",
  description: "Record sold products and customer details.",
  singular: "Sale",
  listPath: APP_ROUTES.sale.products.list,
  addPath: APP_ROUTES.sale.products.add,
  editPath: APP_ROUTES.sale.products.edit,
  afterCreatePath: (record: SaleRecord) => APP_ROUTES.sale.products.payment(record.id),
  columns: saleColumns,
  columnsPerRow: 2 as const,
  loadFields: async (record?: SaleRecord) => {
    const currentSale = record ? `?currentSaleId=${encodeURIComponent(record.id)}` : "";
    const [products, taxes] = await Promise.all([
      apiClient.get<SaleProductOption[]>(`/products/all${currentSale}`),
      apiClient.get<SaleTaxOption[]>("/taxes/all"),
    ]);
    return createSaleFormConfig(products, async (query) => {
      const params = new URLSearchParams({ search: query, limit: "10" });
      return apiClient.get<CustomerLookupRecord[]>(`/customers?${params}`);
    }, taxes);
  },
  api: salesApi,
};
