import { productTypeColumns } from "../config/productType.columns";
import { createProductTypeFormConfig } from "../config/productType.form";
import type { ProductType } from "../types/productType.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";

type LookupRecord = ResourceRecord & { name: string };
const vendorsApi = createResourceApi<LookupRecord>("/vendors/all");
const brandsApi = createResourceApi<LookupRecord>("/brands");

export const productTypeResource = {
  title: "Product Types", description: "Manage product classifications.", singular: "Product Type",
  listPath: "/products/types/list", addPath: "/products/types/add",
  editPath: (id: string) => `/products/types/${id}/edit`, columns: productTypeColumns,
  loadFields: async () => {
    const [vendors, brands] = await Promise.all([vendorsApi.list(), brandsApi.list()]);
    return createProductTypeFormConfig({ vendors, brands });
  },
  api: createResourceApi<ProductType>("/product-types"),
};
