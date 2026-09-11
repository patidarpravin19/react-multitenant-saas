import { Route } from "react-router-dom";

import { VendorListPage } from "../vendor/pages/VendorListPage";
import { VendorFormPage } from "../vendor/pages/VendorFormPage";
import { BrandPage } from "../brand/pages/BrandPage";
import { ProductTypePage } from "../product-type/pages/ProductTypePage";
import { ProductModelPage } from "../product-model/pages/ProductModelPage";
import { VariantPage } from "../variant/pages/VariantPage";
import { ProductPage } from "../product/pages/ProductPage";
import { APP_ROUTES } from "../../../config/routes";



export function ProductRoutes() {
    return (
        <>
            <Route
                path={
                    APP_ROUTES.products.vendors.list
                }
                element={
                    <VendorListPage />
                }
            />
            <Route path={APP_ROUTES.products.vendors.add} element={<VendorFormPage mode="create" />} />
            <Route path="/products/vendors/:id/edit" element={<VendorFormPage mode="edit" />} />

            <Route
                path={
                    APP_ROUTES
                        .products
                        .brands.list
                }
                element={
                    <BrandPage />
                }
            />

            <Route
                path={
                    APP_ROUTES
                        .products
                        .types.list
                }
                element={
                    <ProductTypePage />
                }
            />

            <Route
                path={
                    APP_ROUTES
                        .products
                        .models.list
                }
                element={
                    <ProductModelPage />
                }
            />

            <Route
                path={
                    APP_ROUTES
                        .products
                        .variants.list
                }
                element={
                    <VariantPage />
                }
            />

            <Route
                path={
                    APP_ROUTES.products.products.list
                }
                element={
                    <ProductPage />
                }
            />
            {/* <Route
                path="/products/vendors"
                element={<VendorPage />}
            />

            <Route
                path="/products/types"
                element={<ProductTypePage />}
            />

            <Route
                path="/products/categories"
                element={<CategoryPage />}
            />

            <Route
                path="/products/variants"
                element={<VariantPage />}
            />

            <Route
                path="/products/list"
                element={<ProductPage />}
            /> */}
        </>
    );
}
