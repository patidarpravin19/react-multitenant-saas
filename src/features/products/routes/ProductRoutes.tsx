import { Navigate, Route } from "react-router-dom";
import { brandColumns } from "../brand/config/brand.columns";
import { createBrandFormConfig } from "../brand/config/brand.form";
import type { Brand } from "../brand/types/brand.types";
import { productModelColumns } from "../product-model/config/productModel.columns";
import { createProductModelFormConfig } from "../product-model/config/product-model.form";
import type { ProductModel } from "../product-model/types/productType.types";
import { productColumns } from "../product/config/product.columns";
import { createProductFormConfig } from "../product/config/product.form";
import type { Product } from "../product/types/product.types";
import { productTypeColumns } from "../product-type/config/productType.columns";
import { createProductTypeFormConfig } from "../product-type/config/productType.form";
import type { ProductType } from "../product-type/types/productType.types";
import {
  ResourceFormPage,
  ResourceListPage,
  type ResourcePageProps,
} from "../shared/ResourceCrudPages";
import { createResourceApi, type ResourceRecord } from "../shared/resourceApi";
import { variantColumns } from "../variant/config/variant.columns";
import { createVariantFormConfig } from "../variant/config/variant.form";
import type { ProductVariant } from "../variant/types/variant.types";
import { vendorColumns } from "../vendor/config/vendor.columns";
import { vendorFormConfig } from "../vendor/config/vendor.form";
import type { Vendor } from "../vendor/types/vendor.types";

type LookupRecord = ResourceRecord & { name: string };

const vendorLookupApi = createResourceApi<LookupRecord>("/vendors/all");
const brandLookupApi = createResourceApi<LookupRecord>("/brands");
const typeLookupApi = createResourceApi<LookupRecord>("/product-types");
const modelLookupApi = createResourceApi<LookupRecord>("/product-models");
const variantLookupApi = createResourceApi<LookupRecord>("/variants");

const resources = {
  vendors: {
    title: "Vendors", description: "Manage product vendors and suppliers.", singular: "Vendor",
    listPath: "/products/vendors/list",
    addPath: "/products/vendors/add",
    editPath: (id: string) => `/products/vendors/${id}/edit`, columns: vendorColumns,
    fields: vendorFormConfig, api: createResourceApi<Vendor>("/vendors"),
  },
  brands: {
    title: "Brands", description: "Manage product brands.", singular: "Brand",
    listPath: "/products/brands/list",
    addPath: "/products/brands/add",
    editPath: (id: string) => `/products/brands/${id}/edit`, columns: brandColumns,
    loadFields: async () => createBrandFormConfig({ vendors: await vendorLookupApi.list() }),
    api: createResourceApi<Brand>("/brands"),
  },
  types: {
    title: "Product Types", description: "Manage product classifications.", singular: "Product Type",
    listPath: "/products/types/list",
    addPath: "/products/types/add",
    editPath: (id: string) => `/products/types/${id}/edit`, columns: productTypeColumns,
    loadFields: async () => {
      const [vendors, brands] = await Promise.all([vendorLookupApi.list(), brandLookupApi.list()]);
      return createProductTypeFormConfig({ vendors, brands });
    }, api: createResourceApi<ProductType>("/product-types"),
  },
  models: {
    title: "Product Models", description: "Manage product models.", singular: "Product Model",
    listPath: "/products/models/list",
    addPath: "/products/models/add",
    editPath: (id: string) => `/products/models/${id}/edit`, columns: productModelColumns,
    loadFields: async () => {
      const [productTypes, brands] = await Promise.all([typeLookupApi.list(), brandLookupApi.list()]);
      return createProductModelFormConfig({ productTypes, brands });
    }, api: createResourceApi<ProductModel>("/product-models"),
  },
  variants: {
    title: "Variants", description: "Manage product variants and specifications.", singular: "Variant",
    listPath: "/products/variants/list",
    addPath: "/products/variants/add",
    editPath: (id: string) => `/products/variants/${id}/edit`, columns: variantColumns,
    loadFields: async () => createVariantFormConfig({ models: await modelLookupApi.list() }),
    api: createResourceApi<ProductVariant>("/variants"),
  },
  products: {
    title: "Products", description: "Manage inventory products, variants, pricing and stock.", singular: "Product",
    listPath: "/products/list",
    addPath: "/products/add",
    editPath: (id: string) => `/products/${id}/edit`, columns: productColumns,
    loadFields: async () => {
      const [vendors, productTypes, categories, variants] = await Promise.all([
        vendorLookupApi.list(), typeLookupApi.list(), modelLookupApi.list(), variantLookupApi.list(),
      ]);
      return createProductFormConfig({ vendors, productTypes, categories, variants });
    }, api: createResourceApi<Product>("/products"),
  },
};

function createResourceRoutes<T extends ResourceRecord>(resource: ResourcePageProps<T>, path: string) {
  return <Route path={path}>
    <Route index element={<Navigate to="list" replace />} />
    <Route path="list" element={<ResourceListPage {...resource} />} />
    <Route path="add" element={<ResourceFormPage {...resource} mode="create" />} />
    <Route path=":id/edit" element={<ResourceFormPage {...resource} mode="edit" />} />
  </Route>;
}

export const productRoutes = <>
  {createResourceRoutes(resources.vendors, "/products/vendors")}
  {createResourceRoutes(resources.brands, "/products/brands")}
  {createResourceRoutes(resources.types, "/products/types")}
  {createResourceRoutes(resources.models, "/products/models")}
  {createResourceRoutes(resources.variants, "/products/variants")}
  {createResourceRoutes(resources.products, "/products")}
</>;
