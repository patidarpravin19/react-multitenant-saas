import { productColumns } from "../config/product.columns";
import { createProductFormConfig } from "../config/product.form";
import type { Product } from "../types/product.types";
import { createResourceApi, type ResourceRecord } from "../../../shared/resourceApi";
import type { TaxRate } from "../../../settings/tax/types/tax.types";
import { APP_ROUTES } from "../../../../config/routes";

type LookupRecord = ResourceRecord & { name: string; brandId?: string; productTypeId?: string };
const vendorsApi = createResourceApi<LookupRecord>("/vendors/all");
const brandsApi = createResourceApi<LookupRecord>("/brands/all");
const typesApi = createResourceApi<LookupRecord>("/product-types/all");
const modelsApi = createResourceApi<LookupRecord>("/product-models/all");
const variantsApi = createResourceApi<LookupRecord>("/variants/all");
const colorsApi = createResourceApi<LookupRecord>("/colors/all");
const taxRatesApi = createResourceApi<TaxRate>("/taxes/all");
const productsApi = createResourceApi<Product>("/products");

async function getCurrentTaxRates() {
  const taxRates = await taxRatesApi.list(true);
  const activeTax = taxRates.find((taxRate) => taxRate.isActive) ?? taxRates[0];
  return { cgst: activeTax?.cgst ?? 0, sgst: activeTax?.sgst ?? 0 };
}

export const productResource = {
  title: "Products", description: "Manage inventory products, variants, pricing and stock.", singular: "Product",
  listPath: APP_ROUTES.purchase.products.list,
  addPath: APP_ROUTES.purchase.products.add,
  editPath: APP_ROUTES.purchase.products.edit, columns: productColumns,
  columnsPerRow: 3 as const,
  loadFields: async () => {
    const [vendors, brands, productTypes, models, variants, colors, taxRates] = await Promise.all([
      vendorsApi.list(), brandsApi.list(), typesApi.list(), modelsApi.list(), variantsApi.list(), colorsApi.list(), getCurrentTaxRates(),
    ]);
    return createProductFormConfig({ vendors, brands, productTypes, models, variants, colors, ...taxRates });
  },
  api: {
    ...productsApi,
    getById: async (id: string) => {
      const [product, taxRates] = await Promise.all([
        productsApi.getById(id),
        getCurrentTaxRates(),
      ]);
      return { ...taxRates, ...product };
    },
  },
};
