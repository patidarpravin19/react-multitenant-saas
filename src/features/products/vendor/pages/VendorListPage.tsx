import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import { useNotifications } from "../../../../context/NotificationContext";
import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";
import { vendorColumns } from "../config/vendor.columns";
import { vendorApi } from "../services/vendorApi";
import type { Vendor } from "../types/vendor.types";

export function VendorListPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadVendors = useCallback(async () => {
    try {
      setError(null);
      setVendors(await vendorApi.list());//.filter((vendor) => !vendor.isDelete));
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Unable to load vendors.";
      setError(message);
      notificationsRef.current.error("Vendors could not be loaded", message);
    }
  }, []);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage product vendors and suppliers.
          </p>
        </div>
        <Button onClick={() => navigate("/products/vendors/add")}>
          <Plus size={17} /> Add Vendor
        </Button>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      ) : null}
      <DynamicGrid
        title="Vendor List"
        columns={vendorColumns}
        data={vendors}
        mode="client"
        getRowId={(vendor) => vendor.id}
        onRowClick={(vendor) => navigate(`/products/vendors/${vendor.id}/edit`)}
        emptyMessage="No vendors have been created yet."
      />
    </div>
  );
}
