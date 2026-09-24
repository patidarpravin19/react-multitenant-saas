import { variantColumns } from "../config/variant.columns";
import { createVariantFormConfig } from "../config/variant.form";
import type { ProductVariant } from "../types/variant.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";

type LookupRecord = ResourceRecord & { name: string };
const modelsApi = createResourceApi<LookupRecord>("/product-models");

export const variantResource = {
  title: "Variants", description: "Manage product variants and specifications.", singular: "Variant",
  listPath: "/products/variants/list", addPath: "/products/variants/add",
  editPath: (id: string) => `/products/variants/${id}/edit`, columns: variantColumns,
  loadFields: async () => createVariantFormConfig({ models: await modelsApi.list() }),
  api: createResourceApi<ProductVariant>("/variants"),
};
