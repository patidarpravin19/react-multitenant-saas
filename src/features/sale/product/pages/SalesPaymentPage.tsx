import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import { apiClient } from "../../../../services/apiClient";
import type { FormFieldConfig } from "../../../../types/form";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import type { SaleRecord } from "../types/sale.types";

type PaymentMode = "Cash" | "Finance";

interface FinanceVendorOption {
  id: string;
  name: string;
  code: string;
}

interface SalesPaymentRecord {
  id: string;
  salesProductId: string;
  paymentMode: PaymentMode;
  financeVendorId: string | null;
  financeVendorName: string | null;
  downPayment: number | null;
  numberOfEmi: number | null;
  emiAmount: number | null;
  hasInsurance: boolean | null;
  insuranceAmount: number | null;
  firstInstallmentDate: string | null;
}

const financeFields: FormFieldConfig[] = [
  {
    id: "financeVendorId", name: "financeVendorId", label: "Finance Company",
    type: "select", required: true, options: [], placeholder: "Choose a finance company",
  },
  { id: "downPayment", name: "downPayment", label: "Down Payment", type: "number", required: true, min: 0, step: 0.01 },
  { id: "numberOfEmi", name: "numberOfEmi", label: "Number of EMI", type: "number", required: true, min: 1, step: 1 },
  { id: "emiAmount", name: "emiAmount", label: "EMI Amount", type: "number", required: true, min: 0.01, step: 0.01 },
  {
    id: "hasInsurance", name: "hasInsurance", label: "Insurance", type: "select", required: true,
    options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }],
  },
  { id: "insuranceAmount", name: "insuranceAmount", label: "Insurance Amount", type: "number", min: 0, step: 0.01, defaultValue: 0, visibleWhen: { field: "hasInsurance", value: "true" } },
  { id: "firstInstallmentDate", name: "firstInstallmentDate", label: "First Installment Date", type: "date", required: true },
];

export function SalesPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<SaleRecord | null>(null);
  const [payment, setPayment] = useState<SalesPaymentRecord | null>(null);
  const [financeVendors, setFinanceVendors] = useState<FinanceVendorOption[]>([]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void Promise.all([
      apiClient.get<SaleRecord>(`/sales/products/${encodeURIComponent(id)}`),
      apiClient.get<SalesPaymentRecord | null>(`/sales/products/${encodeURIComponent(id)}/payment`),
      apiClient.get<FinanceVendorOption[]>("/finance-vendors/all"),
    ]).then(([saleRecord, savedPayment, vendors]) => {
      setSale(saleRecord);
      setPayment(savedPayment);
      setPaymentMode(savedPayment?.paymentMode ?? "Cash");
      setFinanceVendors(vendors);
    }).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Unable to load payment details.");
    });
  }, [id]);

  const fields = useMemo<FormFieldConfig[]>(() => financeFields.map((field) =>
    field.name === "financeVendorId"
      ? { ...field, options: financeVendors.map((vendor) => ({ label: vendor.name, value: vendor.id })) }
      : field,
  ), [financeVendors]);

  if (error) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>;
  if (!sale || !id) return <p className="text-sm text-slate-500">Loading sale…</p>;

  const initialValues = payment ? {
    financeVendorId: payment.financeVendorId ?? "",
    downPayment: payment.downPayment ?? 0,
    numberOfEmi: payment.numberOfEmi ?? 1,
    emiAmount: payment.emiAmount ?? 0,
    hasInsurance: payment.hasInsurance === true ? "true" : "false",
    insuranceAmount: payment.insuranceAmount ?? 0,
    firstInstallmentDate: payment.firstInstallmentDate ?? "",
  } : {
    financeVendorId: "",
    downPayment: 0,
    numberOfEmi: 1,
    emiAmount: 0,
    hasInsurance: "false",
    insuranceAmount: 0,
    firstInstallmentDate: "",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{payment ? "Update Payment Details" : "Add Payment Details"}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {sale.productName} · {sale.customerName} · Selling price ₹{sale.sellingPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Payment mode</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["Cash", "Finance"] as const).map((mode) => (
            <label key={mode} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm ${paymentMode === mode ? "border-[var(--tenant-primary)] bg-slate-50 dark:bg-slate-800" : "border-slate-200 dark:border-slate-700"}`}>
              <input type="radio" name="paymentMode" value={mode} checked={paymentMode === mode} onChange={() => setPaymentMode(mode)} />
              {mode}
            </label>
          ))}
        </div>
      </section>

      {paymentMode === "Finance" && financeVendors.length === 0 ? (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add an active finance company under Settings → Finance Vendors before recording a financed sale.
        </div>
      ) : null}

      <DynamicForm
        key={paymentMode}
        title={paymentMode === "Cash" ? "Cash Payment" : "Finance Details"}
        description={paymentMode === "Cash" ? "Record this sale as a cash purchase." : "Enter the finance company, EMI schedule, and insurance details."}
        fields={paymentMode === "Finance" ? fields : []}
        initialValues={initialValues}
        submitLabel={payment ? "Save Payment Details" : "Record Payment"}
        onCancel={() => navigate("/sales/products/list")}
        onSubmit={async (values) => {
          const hasInsurance = paymentMode === "Finance" ? String(values.hasInsurance) === "true" : null;
          if (hasInsurance && Number(values.insuranceAmount) <= 0)
            throw new Error("Enter an insurance amount greater than zero.");
          const body = {
            salesProductId: id,
            paymentMode,
            financeVendorId: paymentMode === "Finance" ? String(values.financeVendorId) : null,
            downPayment: paymentMode === "Finance" ? Number(values.downPayment) : null,
            numberOfEmi: paymentMode === "Finance" ? Number(values.numberOfEmi) : null,
            emiAmount: paymentMode === "Finance" ? Number(values.emiAmount) : null,
            hasInsurance,
            insuranceAmount: paymentMode === "Finance" && hasInsurance ? Number(values.insuranceAmount) : null,
            firstInstallmentDate: paymentMode === "Finance" ? String(values.firstInstallmentDate || "") : null,
          };
          await apiClient.put<SalesPaymentRecord>(`/sales/products/${encodeURIComponent(id)}/payment`, body);
          navigate("/sales/products/list");
        }}
      />
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => navigate("/sales/products/list")}>Back to sales</Button>
      </div>
    </div>
  );
}
