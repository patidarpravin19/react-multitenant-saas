import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./features/auth/LoginPage";
import { ForgotPasswordPage, ResetPasswordPage } from "./features/auth/PasswordRecoveryPages";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { ChangePasswordPage } from "./features/auth/ChangePasswordPage";
import { productRoutes } from "./features/products/routes/ProductRoutes";
import { TaxFormPage } from "./features/settings/tax/pages/TaxFormPage";
import { TaxListPage } from "./features/settings/tax/pages/TaxListPage";
import { FinanceVendorFormPage } from "./features/settings/finance-vendor/pages/FinanceVendorFormPage";
import { FinanceVendorListPage } from "./features/settings/finance-vendor/pages/FinanceVendorListPage";
import { purchaseRoutes } from "./features/purchase/routes/PurchaseRoutes";
import { saleRoutes } from "./features/sale/routes/SaleRoutes";

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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/account/change-password" element={<ChangePasswordPage />} />
          {productRoutes}
          {purchaseRoutes}
          {saleRoutes}
          <Route path="/settings/taxes">
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<TaxListPage />} />
            <Route path="add" element={<TaxFormPage mode="create" />} />
            <Route path=":id/edit" element={<TaxFormPage mode="edit" />} />
          </Route>
          <Route path="/settings/finance-vendors">
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<FinanceVendorListPage />} />
            <Route path="add" element={<FinanceVendorFormPage mode="create" />} />
            <Route path=":id/edit" element={<FinanceVendorFormPage mode="edit" />} />
          </Route>

          <Route path="**" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
