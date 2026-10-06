import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { ResourceFormPage } from "../../../shared/ResourceCrudPages";
import { productResource } from "./productResource";

interface SerialPair {
  serialNumber: string;
  serialNumber1: string;
}

function BulkProductCreateForm() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Awaited<ReturnType<typeof productResource.loadFields>> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serialPairs, setSerialPairs] = useState<SerialPair[]>([{ serialNumber: "", serialNumber1: "" }]);

  useEffect(() => {
    let active = true;
    void productResource.loadFields().then((loadedFields) => {
      if (active) setFields(loadedFields.filter((field) => !["serialNumber", "serialNumber1", "quantity", "totalAmount"].includes(field.name)));
    }).catch((reason: unknown) => {
      if (active) setLoadError(reason instanceof Error ? reason.message : "Unable to load product form data.");
    });
    return () => { active = false; };
  }, []);

  if (loadError) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>;
  if (!fields) return <p className="text-sm text-slate-500">Loading form…</p>;

  const updateSerial = (index: number, key: keyof SerialPair, value: string) => {
    setSerialPairs((current) => current.map((pair, pairIndex) => pairIndex === index ? { ...pair, [key]: value } : pair));
  };

  return (
    <DynamicForm
      title="Add Products"
      description="Enter shared purchase details once, then add both serial numbers for every unit."
      fields={fields}
      columnsPerRow={3}
      submitLabel={`Save ${serialPairs.length} ${serialPairs.length === 1 ? "unit" : "units"}`}
      onCancel={() => navigate(productResource.listPath)}
      onSubmit={async (values) => {
        if (serialPairs.some((pair) => !pair.serialNumber.trim() || !pair.serialNumber1.trim()))
          throw new Error("Enter both serial numbers for every unit.");
        await productResource.api.create({ ...values, serialPairs });
        navigate(productResource.listPath);
      }}
    >
      <section className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700" aria-labelledby="unit-serials-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="unit-serials-heading" className="text-sm font-semibold text-slate-900 dark:text-slate-100">Unit serial numbers</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Both values are required and must be unique across all units.</p>
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{serialPairs.length} {serialPairs.length === 1 ? "unit" : "units"}</span>
        </div>
        {serialPairs.map((pair, index) => (
          <div key={index} className="grid grid-cols-1 items-end gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto] dark:bg-slate-800/50">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="mb-1 block">Unit {index + 1} · Serial Number <span className="text-red-600">*</span></span>
              <input required maxLength={100} value={pair.serialNumber} onChange={(event) => updateSerial(index, "serialNumber", event.target.value)} autoComplete="off" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="mb-1 block">Unit {index + 1} · Serial Number 1 <span className="text-red-600">*</span></span>
              <input required maxLength={100} value={pair.serialNumber1} onChange={(event) => updateSerial(index, "serialNumber1", event.target.value)} autoComplete="off" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            {serialPairs.length > 1 ? <Button type="button" variant="secondary" aria-label={`Remove unit ${index + 1}`} onClick={() => setSerialPairs((current) => current.filter((_, pairIndex) => pairIndex !== index))}>Remove</Button> : <span />}
          </div>
        ))}
        <Button type="button" variant="secondary" disabled={serialPairs.length >= 500} onClick={() => setSerialPairs((current) => [...current, { serialNumber: "", serialNumber1: "" }])}>
          {serialPairs.length >= 500 ? "Maximum 500 units" : "+ Add another unit"}
        </Button>
      </section>
    </DynamicForm>
  );
}


export function ProductFormPage({ mode }: { mode: "create" | "edit" }) {
  return mode === "create" ? <BulkProductCreateForm /> : <ResourceFormPage {...productResource} mode={mode} />;
}
