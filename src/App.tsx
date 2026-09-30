import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { productRoutes } from "./features/products/routes/ProductRoutes";
import { TaxFormPage } from "./features/settings/tax/pages/TaxFormPage";
import { TaxListPage } from "./features/settings/tax/pages/TaxListPage";
import { FinanceVendorFormPage } from "./features/settings/finance-vendor/pages/FinanceVendorFormPage";
import { FinanceVendorListPage } from "./features/settings/finance-vendor/pages/FinanceVendorListPage";
import { purchaseRoutes } from "./features/purchase/routes/PurchaseRoutes";

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
          {productRoutes}
          {purchaseRoutes}
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
