import { AppShell } from "./components/layout/AppShell";
import { DynamicForm } from "./features/dynamic-form/DynamicForm";
import { profileFormConfig } from "./features/dynamic-form/config/profileFormConfig";

export default function App() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--tenant-primary)]">
          Workspace settings
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          User profile
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          This screen demonstrates tenant-aware styling, responsive layout,
          runtime form configuration, validation, and reusable field registration.
        </p>
      </div>

      <DynamicForm
        title="Profile information"
        description="Update account details for the current tenant workspace."
        fields={profileFormConfig}
        onSubmit={async (values) => {
          await new Promise((resolve) => window.setTimeout(resolve, 700));
          console.info("Submitted values", values);
        }}
      />
    </AppShell>
  );
}
