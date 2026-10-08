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
import { CustomerBillSettingsPage } from "./features/settings/customer-bill/CustomerBillSettingsPage";
import { AuditLogsPage } from "./features/settings/audit-logs/AuditLogsPage";
import { GeneralLedgerPage } from "./features/accounting/GeneralLedgerPage";
import { AgingReportPage } from "./features/accounting/AgingReportPage";
import { AccountingPeriodsPage } from "./features/accounting/AccountingPeriodsPage";
import { BankReconciliationPage } from "./features/accounting/BankReconciliationPage";
import { StockMovementsPage } from "./features/accounting/StockMovementsPage";
import { TaxReportsPage } from "./features/accounting/TaxReportsPage";
import { AccountingControlsPage } from "./features/accounting/AccountingControlsPage";
import { InvoiceCorrectionsPage } from "./features/accounting/InvoiceCorrectionsPage";
import { OpeningBalancesPage } from "./features/accounting/OpeningBalancesPage";
import { OpeningStockFormPage } from "./features/accounting/OpeningStockFormPage";
import { StaffAccessPage } from "./features/accounting/StaffAccessPage";
import { AcceptInvitationPage } from "./features/auth/AcceptInvitationPage";
import { purchaseRoutes } from "./features/purchase/routes/PurchaseRoutes";
import { saleRoutes } from "./features/sale/routes/SaleRoutes";
import { APP_ROUTES } from "./config/routes";

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
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/account/change-password" element={<ChangePasswordPage />} />
          <Route path={APP_ROUTES.generalLedger} element={<GeneralLedgerPage />} />
          <Route path={APP_ROUTES.accountingAging} element={<AgingReportPage />} />
          <Route path={APP_ROUTES.taxReports} element={<TaxReportsPage />} />
          <Route path={APP_ROUTES.accountingPeriods} element={<AccountingPeriodsPage />} />
          <Route path={APP_ROUTES.bankReconciliation} element={<BankReconciliationPage />} />
          <Route path={APP_ROUTES.stockMovements} element={<StockMovementsPage />} />
          <Route path={APP_ROUTES.accountingControls} element={<AccountingControlsPage />} />
          <Route path="/accounting/corrections" element={<InvoiceCorrectionsPage />} />
          <Route path="/accounting/opening-balances" element={<OpeningBalancesPage />} />
          <Route path="/accounting/opening-stock/add" element={<OpeningStockFormPage />} />
          <Route path="/accounting/staff" element={<StaffAccessPage />} />
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
          <Route path={APP_ROUTES.settings.customerBill} element={<CustomerBillSettingsPage />} />
          <Route path={APP_ROUTES.settings.auditLogs} element={<AuditLogsPage />} />

          <Route path="**" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
