import { brandColumns } from "../config/brand.columns";
import { createBrandFormConfig } from "../config/brand.form";
import type { Brand } from "../types/brand.types";
import { createResourceApi, type ResourceRecord } from "../../shared/resourceApi";

type LookupRecord = ResourceRecord & { name: string };
const vendorsApi = createResourceApi<LookupRecord>("/vendors/all");

export const brandResource = {
  title: "Brands",
  description: "Manage product brands.",
  singular: "Brand",
  listPath: "/products/brands/list",
  addPath: "/products/brands/add",
  editPath: (id: string) => `/products/brands/${id}/edit`,
  columns: brandColumns,
  loadFields: async () => createBrandFormConfig({ vendors: await vendorsApi.list(true) }),
  api: createResourceApi<Brand>("/brands"),
};
