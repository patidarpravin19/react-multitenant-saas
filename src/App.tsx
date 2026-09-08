import { useState } from "react";
import { useNotifications } from "./context/NotificationContext";
import { AppShell } from "./components/layout/AppShell";
import { DynamicForm } from "./features/dynamic-form/DynamicForm";
import { allControlsFormConfig } from "./features/dynamic-form/config/allControlsFormConfig";
import { DynamicGrid } from "./features/dynamic-grid/DynamicGrid";
import { employeeGridColumns } from "./features/dynamic-grid/config/employeeGridColumns";
import { employees } from "./features/dynamic-grid/data/employees";
import { mockEmployeeServer } from "./features/dynamic-grid/services/mockEmployeeServer";
import type { GridMode } from "./types/grid";

export default function App() {
  const notifications = useNotifications();
  const [gridMode, setGridMode] = useState<GridMode>("client");
  const [view, setView] = useState<"grid" | "form">("grid");

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-primary)]">UI platform</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dynamic enterprise components</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">Configuration-driven forms and data grids with reusable contracts for multi-tenant SaaS products.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => notifications.success("Saved successfully", "Your changes have been saved.")} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Toast</button>
          <button type="button" onClick={() => notifications.alert({ title: "Service notice", message: "This is a persistent shared alert component.", variant: "warning" })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Alert</button>
          <button type="button" onClick={async () => { const confirmed = await notifications.confirm({ title: "Delete employee?", message: "This action cannot be undone.", variant: "danger", confirmLabel: "Delete" }); if (confirmed) notifications.success("Confirmed", "The action was approved."); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Confirm</button>
          <button type="button" onClick={() => setView("grid") } className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${view === "grid" ? "bg-[var(--tenant-primary)] text-white shadow-sm" : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}>Dynamic Grid</button>
          <button type="button" onClick={() => setView("form")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${view === "form" ? "bg-[var(--tenant-primary)] text-white shadow-sm" : "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}>Dynamic Form</button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div><p className="text-sm font-bold text-slate-900 dark:text-slate-100">Processing mode</p><p className="text-xs text-slate-500 dark:text-slate-400">Use the same grid with either an in-memory dataset or a server data source.</p></div>
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {(["client", "server"] as GridMode[]).map(mode => <button key={mode} type="button" onClick={() => setGridMode(mode)} className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-all duration-300 ${gridMode === mode ? "bg-white text-[var(--tenant-primary)] shadow-sm dark:bg-slate-700" : "text-slate-500 dark:text-slate-400"}`}>{mode}</button>)}
            </div>
          </div>

          <DynamicGrid
            key={gridMode}
            title="Employee directory"
            description="Search, filter, multi-sort, page, select, customize columns, change density, refresh and export. Hold Shift while sorting to add another sort column."
            columns={employeeGridColumns}
            mode={gridMode}
            data={gridMode === "client" ? employees : undefined}
            serverSource={gridMode === "server" ? mockEmployeeServer : undefined}
            getRowId={row => row.id}
            initialPageSize={10}
            initialSort={[{ field: "name", direction: "asc" }]}
            onRowClick={row => console.info("Grid row clicked", row)}
            onSelectionChange={rows => console.info("Grid selection", rows)}
          />
        </div>
      ) : (
        <DynamicForm title="Employee profile" description="All supported baseline controls are demonstrated below." fields={allControlsFormConfig} onSubmit={async values => { await new Promise(r => window.setTimeout(r, 900)); console.info("Submitted values", values); }} />
      )}
    </AppShell>
  );
}
