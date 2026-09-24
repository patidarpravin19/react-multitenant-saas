import { productColumns } from "../config/product.columns";
import { createProductFormConfig } from "../config/product.form";
import type { Product } from "../types/product.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";

type LookupRecord = ResourceRecord & { name: string };
const vendorsApi = createResourceApi<LookupRecord>("/vendors/all");
const typesApi = createResourceApi<LookupRecord>("/product-types");
const categoriesApi = createResourceApi<LookupRecord>("/product-categories");
const variantsApi = createResourceApi<LookupRecord>("/variants");

export const productResource = {
  title: "Products", description: "Manage inventory products, variants, pricing and stock.", singular: "Product",
  listPath: "/products/list", addPath: "/products/add",
  editPath: (id: string) => `/products/${id}/edit`, columns: productColumns,
  loadFields: async () => {
    const [vendors, productTypes, categories, variants] = await Promise.all([
      vendorsApi.list(), typesApi.list(), categoriesApi.list(), variantsApi.list(),
    ]);
    return createProductFormConfig({ vendors, productTypes, categories, variants });
  },
  api: createResourceApi<Product>("/products"),
};
