import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { apiClient } from "../../../services/apiClient";
import { CustomerBillDocument } from "../../sale/accounting/components/CustomerBillDocument";
import { defaultCustomerBillTemplate, type CustomerBillTemplate, type PrintableSalesBill } from "../../sale/accounting/types/customerBill.types";
import { INDIAN_GST_STATES } from "../../sale/invoices/types/salesInvoice.types";

const fieldClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--tenant-primary)] focus:ring-2 focus:ring-[var(--tenant-primary)]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

const exampleBill: PrintableSalesBill = {
  billNumber: "SM-2026-000001",
  billDate: new Date().toISOString().slice(0, 10),
  customerName: "Sample Customer",
  customerMobile: "+91 98765 43210",
  customerAddress: "Customer address",
  customerEmail: "customer@example.com",
  productName: "Brand · Model · Variant · Color",
  serialNumber: "SN-123456789",
  sellingPrice: 24999,
  discount: 1000,
  taxableAmount: 23999,
  cgstRate: 9,
  cgstAmount: 2160,
  sgstRate: 9,
  sgstAmount: 2160,
  totalAmount: 28319,
  amountPaid: 10000,
  balance: 18319,
  paymentStatus: "Partially paid",
  payments: [{ id: "sample-payment", amount: 10000, paymentMode: "UPI", paymentDate: new Date().toISOString().slice(0, 10), referenceNumber: "UPI123456" }],
};

const visibilityOptions: [keyof CustomerBillTemplate, string][] = [
  ["showCustomerEmail", "Show customer email"],
  ["showSerialNumber", "Show product serial number"],
  ["showDiscount", "Show discount"],
  ["showPaymentHistory", "Show payment history"],
  ["showBalanceDue", "Show balance due"],
];

export function CustomerBillSettingsPage() {
  const [template, setTemplate] = useState<CustomerBillTemplate>(defaultCustomerBillTemplate);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setTemplate(await apiClient.get<CustomerBillTemplate>("/settings/customer-bill"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load customer bill settings.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function update<K extends keyof CustomerBillTemplate>(key: K, value: CustomerBillTemplate[K]) {
    setTemplate((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function onText(key: "companyName" | "companyAddress" | "companyMobile" | "companyEmail" | "taxRegistrationNumber" | "billTitle" | "footerNote") {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, event.target.value as CustomerBillTemplate[typeof key]);
  }

  async function save() {
    try {
      setSaving(true);
      setError(null);
      setTemplate(await apiClient.put<CustomerBillTemplate>("/settings/customer-bill", template));
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save customer bill settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading bill template…</p>;

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div><h1 className="text-xl font-semibold tracking-tight">Customer Bill</h1><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Configure the sales bill layout, business details, and visible information.</p></div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setTemplate(defaultCustomerBillTemplate); setSaved(false); }}><RotateCcw size={15} /> Reset preview</Button>
          <Button onClick={() => void save()} disabled={saving}><Check size={15} /> {saving ? "Saving…" : saved ? "Saved" : "Save template"}</Button>
        </div>
      </header>

      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(320px,400px)_1fr]">
        <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" onSubmit={(event) => { event.preventDefault(); void save(); }}>
          <div><h2 className="text-base font-semibold">Business and layout</h2><p className="mt-0.5 text-xs text-slate-500">These settings apply to printed sales bills for this tenant.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium sm:col-span-2">Business name<input className={fieldClass} maxLength={200} value={template.companyName} onChange={onText("companyName")} required /></label>
            <label className="text-xs font-medium sm:col-span-2">Business address<textarea className={fieldClass} rows={2} maxLength={500} value={template.companyAddress} onChange={onText("companyAddress")} required /></label>
            <label className="text-xs font-medium">Business phone<input className={fieldClass} maxLength={20} value={template.companyMobile} onChange={onText("companyMobile")} required /></label>
            <label className="text-xs font-medium">Email<input type="email" className={fieldClass} maxLength={256} value={template.companyEmail ?? ""} onChange={onText("companyEmail")} /></label>
            <label className="text-xs font-medium">GSTIN / Tax ID
              <input
                className={fieldClass}
                maxLength={50}
                placeholder="e.g. 27AABCU9603R1ZM"
                value={template.taxRegistrationNumber ?? ""}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  update("taxRegistrationNumber", val);
                  if (val.length >= 2 && !template.stateCode) {
                    const matchedState = INDIAN_GST_STATES.find(s => s.code === val.slice(0, 2));
                    if (matchedState) {
                      update("stateCode", matchedState.code);
                      update("stateName", matchedState.name);
                    }
                  }
                }}
              />
            </label>
            <label className="text-xs font-medium">Home State (GST)
              <select
                className={fieldClass}
                value={template.stateCode ?? ""}
                onChange={(e) => {
                  const code = e.target.value;
                  const found = INDIAN_GST_STATES.find(s => s.code === code);
                  update("stateCode", code || null);
                  update("stateName", found?.name ?? null);
                }}
              >
                <option value="">Select State / UT</option>
                {INDIAN_GST_STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium">Bill heading<input className={fieldClass} maxLength={80} value={template.billTitle} onChange={onText("billTitle")} required /></label>
            <label className="text-xs font-medium">Paper size<select className={fieldClass} value={template.paperSize} onChange={(event) => update("paperSize", event.target.value as CustomerBillTemplate["paperSize"])}><option value="A4">A4</option><option value="A5">A5</option><option value="Thermal80">80 mm thermal receipt</option></select></label>
            <label className="text-xs font-medium sm:col-span-2">Footer note<textarea className={fieldClass} rows={2} maxLength={500} value={template.footerNote} onChange={onText("footerNote")} /></label>
          </div>
          <fieldset className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800"><legend className="px-1 text-xs font-semibold">Show on printed bill</legend>
            {visibilityOptions.map(([key, label]) => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(template[key])} onChange={(event) => update(key, event.target.checked as CustomerBillTemplate[typeof key])} className="size-4 accent-[var(--tenant-primary)]" />{label}</label>)}
          </fieldset>
        </form>

        <div className="min-w-0 space-y-2">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">Live preview</h2><span className="text-xs text-slate-500">Sample data · {template.paperSize}</span></div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-950"><CustomerBillDocument template={template} bill={exampleBill} /></div>
        </div>
      </div>
    </section>
  );
}
