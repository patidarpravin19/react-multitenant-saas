import { Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { DynamicForm } from "../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../dynamic-grid/DynamicGrid";
import type { FormFieldConfig } from "../../../types/form";
import type { GridColumn } from "../../../types/grid";
import { type ResourceRecord } from "./resourceApi";

interface ResourceApi<T extends ResourceRecord> {
  list: (force?: boolean) => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (values: Record<string, unknown>) => Promise<T>;
  update: (id: string, values: Record<string, unknown>) => Promise<T>;
}

interface ResourcePageProps<T extends ResourceRecord> {
  title: string;
  description: string;
  singular: string;
  listPath: string;
  addPath: string;
  editPath: (id: string) => string;
  columns: GridColumn<T>[];
  fields: FormFieldConfig[];
  api: ResourceApi<T>;
}

export function ResourceListPage<T extends ResourceRecord>(
  props: ResourcePageProps<T>,
) {
  const { title, description, singular, addPath, editPath, columns, api } =
    props;
  const navigate = useNavigate();
  const [records, setRecords] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  // The callback has no notification/context dependency. Consequently a toast or other
  // provider re-render cannot cause another GET request.
  const load = useCallback(
    async (force = false) => {
      try {
        setError(null);
        setRecords(
          (await api.list(force)).filter((record) => !record.isDelete),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : `Unable to load ${title.toLowerCase()}.`,
        );
      }
    },
    [api, title],
  );

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void load();
  }, [load]);

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
          <Button variant="secondary" onClick={() => void load(true)}>
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
        title={`${title} List`}
        columns={columns}
        data={records}
        mode="client"
        getRowId={(record) => record.id}
        onRowClick={(record) => navigate(editPath(record.id))}
        emptyMessage={`No ${title.toLowerCase()} have been created yet.`}
      />
    </div>
  );
}

export function ResourceFormPage<T extends ResourceRecord>(
  props: ResourcePageProps<T> & { mode: "create" | "edit" },
) {
  const { mode, title, singular, listPath, fields, api } = props;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <DynamicForm
      title={mode === "create" ? `Add ${singular}` : `Update ${singular}`}
      description={
        mode === "create"
          ? `Create a new ${singular.toLowerCase()}.`
          : `Update the ${singular.toLowerCase()} details.`
      }
      fields={fields}
      initialValues={record ?? undefined}
      submitLabel={mode === "create" ? `Create ${singular}` : "Save Changes"}
      onCancel={() => navigate(listPath)}
      onSubmit={async (values) => {
        if (mode === "create") await api.create(values);
        else await api.update(id!, values);
        navigate(listPath);
      }}
    />
  );
}
