import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { useNotifications } from "../../../../context/NotificationContext";
import { vendorFormConfig } from "../config/vendor.form";
import { vendorApi, type SaveVendorInput } from "../services/vendorApi";
import type { Vendor } from "../types/vendor.types";

function toInput(values: Record<string, unknown>): SaveVendorInput {
  return { name: String(values.name ?? ""), code: String(values.code ?? ""), description: String(values.description ?? ""), address: String(values.address ?? ""), mobile: String(values.mobile ?? ""), email: String(values.email ?? ""), isActive: Boolean(values.isActive) };
}

export function VendorFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadVendor = useCallback(async () => {
    if (mode !== "edit" || !id) return;
    try { setLoadError(null); setVendor(await vendorApi.getById(id)); }
    catch (reason) { setLoadError(reason instanceof Error ? reason.message : "Unable to load vendor."); }
  }, [id, mode]);
  useEffect(() => { void loadVendor(); }, [loadVendor]);

  if (mode === "edit" && loadError) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>;
  if (mode === "edit" && !vendor) return <p className="text-sm text-slate-500">Loading vendor…</p>;

  return <DynamicForm title={mode === "create" ? "Add Vendor" : "Update Vendor"} description={mode === "create" ? "Create a new product vendor." : "Change the vendor details."} fields={vendorFormConfig} initialValues={vendor ?? undefined} submitLabel={mode === "create" ? "Create Vendor" : "Save Changes"} onCancel={() => navigate("/products/vendors/list")} onSubmit={async values => {
    const saved = mode === "create" ? await vendorApi.create(toInput(values)) : await vendorApi.update(id!, toInput(values));
    notifications.success(mode === "create" ? "Vendor created" : "Vendor updated", `${saved.name} was saved successfully.`);
    navigate("/products/vendors/list");
  }} />;
}
