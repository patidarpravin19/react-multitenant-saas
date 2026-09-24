import { productModelColumns } from "../config/productModel.columns";
import { createProductModelFormConfig } from "../config/product-model.form";
import type { ProductModel } from "../types/productType.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";

type LookupRecord = ResourceRecord & { name: string };
const typesApi = createResourceApi<LookupRecord>("/product-types");
const brandsApi = createResourceApi<LookupRecord>("/brands");

export const productModelResource = {
  title: "Product Models", description: "Manage product models.", singular: "Product Model",
  listPath: "/products/models/list", addPath: "/products/models/add",
  editPath: (id: string) => `/products/models/${id}/edit`, columns: productModelColumns,
  loadFields: async () => {
    const [productTypes, brands] = await Promise.all([typesApi.list(), brandsApi.list()]);
    return createProductModelFormConfig({ productTypes, brands });
  },
  api: createResourceApi<ProductModel>("/product-models"),
};
