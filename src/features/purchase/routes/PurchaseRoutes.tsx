import { Navigate, Route } from "react-router-dom";
import { ProductFormPage } from "../product/pages/ProductFormPage";
import { ProductListPage } from "../product/pages/ProductListPage";

export const purchaseRoutes = <>
  <Route path="/purchase/products">
    <Route index element={<Navigate to="list" replace />} />
    <Route path="list" element={<ProductListPage />} />
    <Route path="add" element={<ProductFormPage mode="create" />} />
    <Route path=":id/edit" element={<ProductFormPage mode="edit" />} />
  </Route>
</>;
