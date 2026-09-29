import { productColumns } from "../config/product.columns";
import { createProductFormConfig } from "../config/product.form";
import type { Product } from "../types/product.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";

type LookupRecord = ResourceRecord & { name: string; brandId?: string; productTypeId?: string };
const vendorsApi = createResourceApi<LookupRecord>("/vendors/all");
const brandsApi = createResourceApi<LookupRecord>("/brands/all");
const typesApi = createResourceApi<LookupRecord>("/product-types/all");
const modelsApi = createResourceApi<LookupRecord>("/product-models/all");
const variantsApi = createResourceApi<LookupRecord>("/variants/all");
const colorsApi = createResourceApi<LookupRecord>("/colors/all");

export const productResource = {
  title: "Products", description: "Manage inventory products, variants, pricing and stock.", singular: "Product",
  listPath: "/products/list", addPath: "/products/add",
  editPath: (id: string) => `/products/${id}/edit`, columns: productColumns,
  columnsPerRow: 3 as const,
  loadFields: async () => {
    const [vendors, brands, productTypes, models, variants, colors] = await Promise.all([
      vendorsApi.list(), brandsApi.list(), typesApi.list(), modelsApi.list(), variantsApi.list(), colorsApi.list(),
    ]);
    return createProductFormConfig({ vendors, brands, productTypes, models, variants, colors });
  },
  api: createResourceApi<Product>("/products"),
};
