import { Navigate, Route } from "react-router-dom";
import { SaleProductFormPage } from "../product/pages/SaleProductFormPage";
import { SaleProductListPage } from "../product/pages/SaleProductListPage";
import { SalesPaymentPage } from "../product/pages/SalesPaymentPage";
import { SalesAccountingPage } from "../accounting/pages/SalesAccountingPage";
import { SalesBillPaymentsPage } from "../accounting/pages/SalesBillPaymentsPage";
import { CustomerListPage } from "../customers/CustomerListPage";
import { CustomerFormPage } from "../customers/CustomerFormPage";
import { CustomerHistoryPage } from "../customers/CustomerHistoryPage";

export const saleRoutes = (
  <>
    <Route path="/sales/accounting" element={<SalesAccountingPage />} />
    <Route path="/sales/accounting/payments/:id" element={<SalesBillPaymentsPage />} />
    <Route path="/sales/customers">
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<CustomerListPage />} />
      <Route path="add" element={<CustomerFormPage mode="create" />} />
      <Route path=":id/edit" element={<CustomerFormPage mode="edit" />} />
      <Route path=":id/history" element={<CustomerHistoryPage />} />
    </Route>
    <Route path="/sales/products">
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<SaleProductListPage />} />
      <Route path="add" element={<SaleProductFormPage mode="create" />} />
      <Route path=":id/payment" element={<SalesPaymentPage />} />
      <Route path=":id/edit" element={<SaleProductFormPage mode="edit" />} />
    </Route>
  </>
);
