import { productTypeColumns } from "../config/productType.columns";
import { createProductTypeFormConfig } from "../config/productType.form";
import type { ProductType } from "../types/productType.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";
import { apiClient } from "../../../../services/apiClient";

type LookupRecord = ResourceRecord & { name: string };
type BrandLookupRecord = LookupRecord & { vendorId: string };
const vendorsApi = createResourceApi<LookupRecord>("/vendors/all");

async function loadBrands(vendorId: string) {
  const response = await apiClient.get<
    BrandLookupRecord[] | {
      items?: BrandLookupRecord[];
      rows?: BrandLookupRecord[];
      data?: BrandLookupRecord[]
    }
  >(`/brands/all/${encodeURIComponent(vendorId)}`);
  const brands = Array.isArray(response)
    ? response
    : response.items ?? response.rows ?? response.data ?? [];
  return brands.map((brand) => ({ label: brand.name, value: brand.id }));
}

export const productTypeResource = {
  title: "Product Types", description: "Manage product classifications.", singular: "Product Type",
  listPath: "/products/types/list", addPath: "/products/types/add",
  editPath: (id: string) => `/products/types/${id}/edit`, columns: productTypeColumns,
  loadFields: async () =>
    createProductTypeFormConfig({ vendors: await vendorsApi.list(true), loadBrands }),
  api: createResourceApi<ProductType>("/product-types"),
};
