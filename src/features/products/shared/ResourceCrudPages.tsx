import { Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { useNotifications } from "../../../context/NotificationContext";
import { DynamicForm } from "../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../dynamic-grid/DynamicGrid";
import type { FormFieldConfig } from "../../../types/form";
import type { GridColumn, GridServerSource } from "../../../types/grid";
import { type ResourceRecord } from "./resourceApi";

interface ResourceApi<T extends ResourceRecord> {
  list: (force?: boolean) => Promise<T[]>;
  serverSource: GridServerSource<T>;
  getById: (id: string) => Promise<T>;
  create: (values: Record<string, unknown>) => Promise<T>;
  update: (id: string, values: Record<string, unknown>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export interface ResourcePageProps<T extends ResourceRecord> {
  title: string;
  description: string;
  singular: string;
  listPath: string;
  addPath: string;
  editPath: (id: string) => string;
  columns: GridColumn<T>[];
  fields?: FormFieldConfig[];
  loadFields?: () => Promise<FormFieldConfig[]>;
  api: ResourceApi<T>;
}

export function ResourceListPage<T extends ResourceRecord>(
  props: ResourcePageProps<T>,
) {
  const { title, description, singular, addPath, editPath, columns, api } =
    props;
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const deleteRecord = async (record: T) => {
    const confirmed = await notifications.confirm({
      title: `Delete ${singular}?`,
      message: `This will permanently delete this ${singular.toLowerCase()}.`,
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;
    try {
      await api.remove(record.id);
      setRefreshKey((key) => key + 1);
      notifications.success(`${singular} deleted`, "The record was deleted successfully.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : `Unable to delete ${singular.toLowerCase()}.`;
      setError(message);
      notifications.error(`${singular} could not be deleted`, message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setRefreshKey((key) => key + 1)}>
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button onClick={() => navigate(addPath)}>
            <Plus size={17} /> Add {singular}
          </Button>
        </div>
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
        key={title}
        title={`${title} List`}
        columns={columns}
        mode="server"
        serverSource={api.serverSource}
        refreshKey={refreshKey}
        getRowId={(record) => record.id}
        onRowClick={(record) => navigate(editPath(record.id))}
        onDelete={deleteRecord}
        emptyMessage={`No ${title.toLowerCase()} have been created yet.`}
      />
    </div>
  );
}

export function ResourceFormPage<T extends ResourceRecord>(
  props: ResourcePageProps<T> & { mode: "create" | "edit" },
) {
  const { mode, title, singular, listPath, fields, loadFields, api } = props;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<FormFieldConfig[] | null>(
    fields ?? null,
  );
  const loaded = useRef(false);

  const load = useCallback(async () => {
    if (mode !== "edit" || !id) return;
    try {
      setError(null);
      setRecord(await api.getById(id));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : `Unable to load ${singular.toLowerCase()}.`,
      );
    }
  }, [api, id, mode, singular]);
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      void load();
    }
  }, [load]);

  useEffect(() => {
    if (fields) {
      setFormFields(fields);
      return;
    }
    if (!loadFields) return;
    void loadFields()
      .then(setFormFields)
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load form data.",
        ),
      );
  }, [fields, loadFields]);

  if (mode === "edit" && error)
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {error}
      </div>
    );
  if (mode === "edit" && !record)
    return (
      <p className="text-sm text-slate-500">
        Loading {singular.toLowerCase()}…
      </p>
    );
  if (!formFields) return <p className="text-sm text-slate-500">Loading form…</p>;

  return (
    <DynamicForm
      title={mode === "create" ? `Add ${singular}` : `Update ${singular}`}
      description={
        mode === "create"
          ? `Create a new ${singular.toLowerCase()}.`
          : `Update the ${singular.toLowerCase()} details.`
      }
      fields={formFields}
      initialValues={record ?? undefined}
      submitLabel={mode === "create" ? `Create ${singular}` : "Save Changes"}
      onCancel={() => navigate(listPath)}
      onSubmit={async (values) => {
        if (mode === "create") await api.create(values);
        else {
          // `id` is not a visible/registered form field. Preserve the canonical
          // identifier returned by GET so APIs that require it in a PUT payload
          // receive it along with the edited values.
          await api.update(record!.id, { ...values, id: record!.id });
        }
        navigate(listPath);
      }}
    />
  );
}
