import { Navigate, Route } from "react-router-dom";
import { SaleProductFormPage } from "../product/pages/SaleProductFormPage";
import { SaleProductListPage } from "../product/pages/SaleProductListPage";
import { SalesPaymentPage } from "../product/pages/SalesPaymentPage";

export const saleRoutes = (
  <>
    <Route path="/sales/products">
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<SaleProductListPage />} />
      <Route path="add" element={<SaleProductFormPage mode="create" />} />
      <Route path=":id/payment" element={<SalesPaymentPage />} />
      <Route path=":id/edit" element={<SaleProductFormPage mode="edit" />} />
    </Route>
  </>
);
