import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";

import { brandColumns } from "./features/products/brand/config/brand.columns";
import { createBrandFormConfig } from "./features/products/brand/config/brand.form";
import type { Brand } from "./features/products/brand/types/brand.types";
import { productModelColumns } from "./features/products/product-model/config/productModel.columns";
import { createProductModelFormConfig } from "./features/products/product-model/config/product-model.form";
import type { ProductModel } from "./features/products/product-model/types/productType.types";
import { productColumns } from "./features/products/product/config/product.columns";
import { createProductFormConfig } from "./features/products/product/config/product.form";
import type { Product } from "./features/products/product/types/product.types";
import { productTypeColumns } from "./features/products/product-type/config/productType.columns";
import { createProductTypeFormConfig } from "./features/products/product-type/config/productType.form";
import type { ProductType } from "./features/products/product-type/types/productType.types";
import {
  ResourceFormPage,
  ResourceListPage,
} from "./features/products/shared/ResourceCrudPages";
import { createResourceApi } from "./features/products/shared/resourceApi";
import { variantColumns } from "./features/products/variant/config/variant.columns";
import { createVariantFormConfig } from "./features/products/variant/config/variant.form";
import type { ProductVariant } from "./features/products/variant/types/variant.types";
import { vendorColumns } from "./features/products/vendor/config/vendor.columns";
import { vendorFormConfig } from "./features/products/vendor/config/vendor.form";
import type { Vendor } from "./features/products/vendor/types/vendor.types";

const vendors = [
  { id: "vendor-a", name: "Vendor A" },
  { id: "vendor-b", name: "Vendor B" },
];
const brands = [
  { id: "brand-samsung", name: "Samsung" },
  { id: "brand-lg", name: "LG" },
];
const productTypes = [
  { id: "type-mobile", name: "Mobile" },
  { id: "type-tv", name: "TV" },
];
const models = [
  { id: "model-s25", name: "Galaxy S25 FE" },
  { id: "model-oled", name: "OLED C4" },
];

const vendorResource = {
  title: "Vendors",
  description: "Manage product vendors and suppliers.",
  singular: "Vendor",
  listPath: "/products/vendors/list",
  addPath: "/products/vendors/add",
  editPath: (id: string) => `/products/vendors/${id}/edit`,
  columns: vendorColumns,
  fields: vendorFormConfig,
  api: createResourceApi<Vendor>("/vendors"),
};
const brandResource = {
  title: "Brands",
  description: "Manage product brands.",
  singular: "Brand",
  listPath: "/products/brands/list",
  addPath: "/products/brands/add",
  editPath: (id: string) => `/products/brands/${id}/edit`,
  columns: brandColumns,
  fields: createBrandFormConfig({ vendors }),
  api: createResourceApi<Brand>("/brands"),
};
const typeResource = {
  title: "Product Types",
  description: "Manage product classifications.",
  singular: "Product Type",
  listPath: "/products/types/list",
  addPath: "/products/types/add",
  editPath: (id: string) => `/products/types/${id}/edit`,
  columns: productTypeColumns,
  fields: createProductTypeFormConfig({ vendors, brands }),
  api: createResourceApi<ProductType>("/product-types"),
};
const modelResource = {
  title: "Product Models",
  description: "Manage product models.",
  singular: "Product Model",
  listPath: "/products/models/list",
  addPath: "/products/models/add",
  editPath: (id: string) => `/products/models/${id}/edit`,
  columns: productModelColumns,
  fields: createProductModelFormConfig({ productTypes, brands }),
  api: createResourceApi<ProductModel>("/product-models"),
};
const variantResource = {
  title: "Variants",
  description: "Manage product variants and specifications.",
  singular: "Variant",
  listPath: "/products/variants/list",
  addPath: "/products/variants/add",
  editPath: (id: string) => `/products/variants/${id}/edit`,
  columns: variantColumns,
  fields: createVariantFormConfig({ models }),
  api: createResourceApi<ProductVariant>("/variants"),
};
const productResource = {
  title: "Products",
  description: "Manage inventory products, variants, pricing and stock.",
  singular: "Product",
  listPath: "/products/list",
  addPath: "/products/add",
  editPath: (id: string) => `/products/${id}/edit`,
  columns: productColumns,
  fields: createProductFormConfig({
    vendors,
    productTypes,
    categories: models,
    variants: models,
  }),
  api: createResourceApi<Product>("/products"),
};

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />

        <Route
          path="/products/vendors"
          element={<Navigate to="/products/vendors/list" replace />}
        />
        <Route
          path="/products/vendors/list"
          element={<ResourceListPage {...vendorResource} />}
        />
        <Route
          path="/products/vendors/add"
          element={<ResourceFormPage {...vendorResource} mode="create" />}
        />
        <Route
          path="/products/vendors/:id/edit"
          element={<ResourceFormPage {...vendorResource} mode="edit" />}
        />

        <Route
          path="/products/brands"
          element={<Navigate to="/products/brands/list" replace />}
        />
        <Route
          path="/products/brands/list"
          element={<ResourceListPage {...brandResource} />}
        />
        <Route
          path="/products/brands/add"
          element={<ResourceFormPage {...brandResource} mode="create" />}
        />
        <Route
          path="/products/brands/:id/edit"
          element={<ResourceFormPage {...brandResource} mode="edit" />}
        />

        <Route
          path="/products/types"
          element={<Navigate to="/products/types/list" replace />}
        />
        <Route
          path="/products/types/list"
          element={<ResourceListPage {...typeResource} />}
        />
        <Route
          path="/products/types/add"
          element={<ResourceFormPage {...typeResource} mode="create" />}
        />
        <Route
          path="/products/types/:id/edit"
          element={<ResourceFormPage {...typeResource} mode="edit" />}
        />

        <Route
          path="/products/models"
          element={<Navigate to="/products/models/list" replace />}
        />
        <Route
          path="/products/models/list"
          element={<ResourceListPage {...modelResource} />}
        />
        <Route
          path="/products/models/add"
          element={<ResourceFormPage {...modelResource} mode="create" />}
        />
        <Route
          path="/products/models/:id/edit"
          element={<ResourceFormPage {...modelResource} mode="edit" />}
        />

        <Route
          path="/products/variants"
          element={<Navigate to="/products/variants/list" replace />}
        />
        <Route
          path="/products/variants/list"
          element={<ResourceListPage {...variantResource} />}
        />
        <Route
          path="/products/variants/add"
          element={<ResourceFormPage {...variantResource} mode="create" />}
        />
        <Route
          path="/products/variants/:id/edit"
          element={<ResourceFormPage {...variantResource} mode="edit" />}
        />

        <Route
          path="/products/list"
          element={<ResourceListPage {...productResource} />}
        />
        <Route
          path="/products/add"
          element={<ResourceFormPage {...productResource} mode="create" />}
        />
        <Route
          path="/products/:id/edit"
          element={<ResourceFormPage {...productResource} mode="edit" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      </Route>
    </Routes>
  );
}
