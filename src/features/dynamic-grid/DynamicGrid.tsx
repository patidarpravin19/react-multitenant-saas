import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Pencil,
  Trash2,
  Eye,
  SearchX,
  TriangleAlert,
} from "lucide-react";

import type {
  DynamicGridProps,
  GridColumn,
  GridColumnFilter,
  GridAction,
  GridDensity,
  GridEditContext,
  GridQuery,
  GridResult,
  GridSort,
} from "../../types/grid";

import { GridPagination } from "./components/GridPagination";
import { GridToolbar } from "./components/GridToolbar";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import {
  densityClasses,
  downloadCsv,
  getColumnValue,
  processClientRows,
  toCsv,
} from "./lib/gridUtils";

export function DynamicGrid<TData>({
  title,
  description,
  columns,
  mode = "client",
  data = [],
  serverSource,
  getRowId,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  initialSort = [],
  initialSearch = "",
  searchable = true,
  selectable = true,
  showColumnFilters = true,
  showColumnVisibility = true,
  showDensity = true,
  showExport = true,
  stickyHeader = true,
  actions,
  onView,
  onEdit,
  onDelete,
  onRowClick,
  onSelectionChange,
  emptyMessage = "No records match the current query.",
}: DynamicGridProps<TData>) {
  const rowActions = useMemo<GridAction<TData>[]>(
    () => {
      if (actions) return actions;
      const builtInActions: GridAction<TData>[] = [];
      if (onView) builtInActions.push({ id: "view", label: "View", icon: "view", onClick: onView });
      if (onEdit) builtInActions.push({ id: "edit", label: "Edit", icon: "edit", onClick: onEdit });
      if (onDelete) builtInActions.push({ id: "delete", label: "Delete", icon: "delete", variant: "danger", onClick: onDelete });
      return builtInActions;
    },
    [actions, onDelete, onEdit, onView],
  );
  const hasActions = rowActions.length > 0;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 350);
  const [sorting, setSorting] = useState<GridSort[]>(initialSort);
  const [filters, setFilters] = useState<GridColumnFilter[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [density, setDensity] = useState<GridDensity>("comfortable");
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      columns.map((column) => [column.id, column.hidden !== true]),
    ),
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [serverRows, setServerRows] = useState<TData[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const requestId = useRef(0);

  const query = useMemo<GridQuery>(
    () => ({
      pageIndex,
      pageSize,
      search: debouncedSearch,
      sort: sorting,
      filters,
    }),
    [pageIndex, pageSize, debouncedSearch, sorting, filters],
  );

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, sorting, filters, pageSize]);

  useEffect(() => {
    if (mode !== "server") return;
    if (!serverSource) {
      setError("Server mode requires a serverSource.");
      return;
    }

    const controller = new AbortController();
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);

    void serverSource
      .load(query, controller.signal)
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        setServerRows(result.rows);
        setServerTotal(result.totalCount);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted || requestId.current !== currentRequest)
          return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load grid data.",
        );
      })
      .finally(() => {
        if (requestId.current === currentRequest) setIsLoading(false);
      });

    return () => controller.abort();
  }, [mode, serverSource, query, reloadKey]);

  const clientResult = useMemo(
    () => processClientRows(data, columns, query),
    [data, columns, query],
  );

  const rows = mode === "server" ? serverRows : clientResult.rows;
  const totalCount = mode === "server" ? serverTotal : clientResult.totalCount;
  const visibleColumns = useMemo(
    () => columns.filter((column) => visibility[column.id] !== false),
    [columns, visibility],
  );

  const toggleSort = useCallback((columnId: string, multi: boolean) => {
    setSorting((current) => {
      const existing = current.find((sort) => sort.field === columnId);
      let nextForColumn: GridSort | null;
      if (!existing) nextForColumn = { field: columnId, direction: "asc" };
      else if (existing.direction === "asc")
        nextForColumn = { field: columnId, direction: "desc" };
      else nextForColumn = null;

      const remaining = multi
        ? current.filter((sort) => sort.field !== columnId)
        : [];
      return nextForColumn ? [...remaining, nextForColumn] : remaining;
    });
  }, []);

  const updateFilter = useCallback(
    (field: string, value: string) => {
      setFilters((current) => {
        const without = current.filter((filter) => filter.field !== field);
        const column = columns.find((item) => item.id === field);
        return value
          ? [...without, { field, value, operator: column?.filterOperator }]
          : without;
      });
    },
    [columns],
  );

  const toggleRow = useCallback(
    (row: TData) => {
      const id = getRowId(row);
      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [getRowId],
  );

  const visibleRowIds = rows.map(getRowId);
  const allVisibleSelected =
    visibleRowIds.length > 0 &&
    visibleRowIds.every((id) => selectedIds.has(id));

  const toggleVisibleRows = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current);
      const allSelected =
        visibleRowIds.length > 0 && visibleRowIds.every((id) => next.has(id));
      visibleRowIds.forEach((id) =>
        allSelected ? next.delete(id) : next.add(id),
      );
      return next;
    });
  }, [visibleRowIds]);

  useEffect(() => {
    onSelectionChange?.(data.filter((row) => selectedIds.has(getRowId(row))));
  }, [selectedIds, data, getRowId, onSelectionChange]);

  const exportRows = mode === "client" ? data : rows;
  const exportCsv = () =>
    downloadCsv("grid-export.csv", toCsv(exportRows, visibleColumns));
  const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <section
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label={title ?? "Data grid"}
    >
      {title || description ? (
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
          {title ? (
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {mode === "server" ? "Server" : "Client"}
              </span>
            </div>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <GridToolbar
        search={search}
        onSearchChange={setSearch}
        searchable={searchable}
        columns={columns}
        visibility={visibility}
        onToggleColumn={(columnId) =>
          setVisibility((current) => ({
            ...current,
            [columnId]: current[columnId] === false,
          }))
        }
        showColumnVisibility={showColumnVisibility}
        density={density}
        onDensityChange={setDensity}
        showDensity={showDensity}
        showFilters={showColumnFilters}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible((value) => !value)}
        showExport={showExport}
        onExport={exportCsv}
        onRefresh={
          mode === "server" ? () => setReloadKey((key) => key + 1) : undefined
        }
        isLoading={isLoading}
        selectedCount={selectedIds.size}
      />

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-left text-sm"
          role="grid"
          aria-rowcount={totalCount}
          aria-busy={isLoading}
        >
          <thead className={stickyHeader ? "sticky top-0 z-10" : ""}>
            <tr className="border-b border-slate-200 bg-slate-50/95 dark:border-slate-800 dark:bg-slate-950/95">
              {selectable ? (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select current page"
                    checked={allVisibleSelected}
                    onChange={toggleVisibleRows}
                    className="size-4 accent-[var(--tenant-primary)]"
                  />
                </th>
              ) : null}
              {visibleColumns.map((column) => {
                const sort = sorting.find((item) => item.field === column.id);
                const SortIcon =
                  sort?.direction === "asc"
                    ? ArrowUp
                    : sort?.direction === "desc"
                      ? ArrowDown
                      : ArrowUpDown;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    style={{
                      width: column.width,
                      minWidth: column.minWidth ?? 120,
                    }}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}`}
                    aria-sort={
                      sort
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {column.sortable === false ? (
                      column.header
                    ) : (
                      <button
                        type="button"
                        onClick={(event) =>
                          toggleSort(column.id, event.shiftKey)
                        }
                        className="inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                        title="Sort; hold Shift for multi-sort"
                      >
                        {column.header}
                        <SortIcon
                          className={`size-3.5 ${sort ? "text-[var(--tenant-primary)]" : "text-slate-300 dark:text-slate-600"}`}
                          aria-hidden
                        />
                      </button>
                    )}
                  </th>
                );
              })}
              {hasActions ? <th className="w-28 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th> : null}
            </tr>

            {filtersVisible ? (
              <tr className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {selectable ? <th className="px-4 py-2" /> : null}
                {visibleColumns.map((column) => {
                  const value =
                    filters.find((filter) => filter.field === column.id)
                      ?.value ?? "";
                  return (
                    <th key={column.id} className="px-3 py-2">
                      {column.filterable ===
                      false ? null : column.filterOptions ? (
                        <select
                          value={value}
                          onChange={(event) =>
                            updateFilter(column.id, event.target.value)
                          }
                          className="h-9 w-full min-w-28 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                          aria-label={`Filter ${column.header}`}
                        >
                          <option value="">All</option>
                          {column.filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={value}
                          onChange={(event) =>
                            updateFilter(column.id, event.target.value)
                          }
                          placeholder={`Filter ${column.header}`}
                          className="h-9 w-full min-w-28 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                          aria-label={`Filter ${column.header}`}
                        />
                      )}
                    </th>
                  );
                })}
                {hasActions ? <th /> : null}
              </tr>
            ) : null}
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading && rows.length === 0
              ? Array.from({ length: Math.min(pageSize, 8) }, (_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {Array.from({ length: colSpan }, (_, cell) => (
                      <td key={cell} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {!isLoading && error ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-14 text-center">
                  <TriangleAlert
                    className="mx-auto size-8 text-amber-500"
                    aria-hidden
                  />
                  <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">
                    Unable to load data
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {error}
                  </p>
                </td>
              </tr>
            ) : null}

            {!isLoading && !error && rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-14 text-center">
                  <SearchX
                    className="mx-auto size-8 text-slate-400"
                    aria-hidden
                  />
                  <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">
                    No results
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : null}

            {rows.map((row, rowIndex) => {
              const rowId = getRowId(row);
              const selected = selectedIds.has(rowId);
              return (
                <tr
                  key={rowId}
                  aria-selected={selected}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-all duration-300 ${onRowClick ? "cursor-pointer" : ""} ${selected ? "bg-[var(--tenant-secondary)]/70" : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60"}`}
                >
                  {selectable ? (
                    <td
                      className={`px-4 ${densityClasses(density)}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select row ${rowIndex + 1}`}
                        checked={selected}
                        onChange={() => toggleRow(row)}
                        className="size-4 accent-[var(--tenant-primary)]"
                      />
                    </td>
                  ) : null}
                  {/* {visibleColumns.map(column => {
                    const value = getColumnValue(row, column);
                    return (
                      <td key={column.id} className={`px-4 text-slate-700 dark:text-slate-200 ${densityClasses(density)} ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}`}>
                        {column.cell ? column.cell({ row, value, rowIndex }) : value === null || value === undefined ? <span className="text-slate-400">—</span> : String(value)}
                      </td>
                    );
                  })} */}
                  {visibleColumns.map((column, rowIndex) => {
                    const value = getValue(row, column);

                    return (
                      <td
                        key={column.id}
                        className="
                              whitespace-nowrap
                              px-3
                              py-3
                              text-sm
                              text-slate-700

                              dark:text-slate-200
                            "
                      >
                        {column.cell
                          ? column.cell(value, row, {
                              row,
                              value,
                              rowIndex,
                            })
                          : String(value ?? "")}
                      </td>
                    );
                  })}
                  {hasActions ? (
                    <td className={`px-3 text-right ${densityClasses(density)}`} onClick={(event) => event.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        {rowActions.filter((action) => !action.hidden?.(row)).map((action) => {
                          const Icon = action.icon === "delete" ? Trash2 : action.icon === "view" ? Eye : Pencil;
                          return <button
                            key={action.id}
                            type="button"
                            aria-label={action.label}
                            title={action.label}
                            disabled={action.disabled?.(row)}
                            onClick={() => void action.onClick(row)}
                            className={`rounded-md p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${action.variant === "danger" ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                          ><Icon size={16} /></button>;
                        })}
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <GridPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </section>
  );
}

function getColumnKey<TData>(
  column: GridColumn<TData>,
): keyof TData | undefined {
  return column.accessorKey ?? column.accessor;
}

function getValue<TData>(row: TData, column: GridColumn<TData>): unknown {
  if (column.valueGetter) {
    return column.valueGetter(row);
  }

  const key = getColumnKey(column);

  if (!key) {
    return undefined;
  }

  return row[key];
}

function matchesSearch<TData>(
  row: TData,
  columns: GridColumn<TData>[],
  search: string,
): boolean {
  if (!search.trim()) {
    return true;
  }

  const keyword = search.trim().toLowerCase();

  return columns
    .filter((column) => column.searchable !== false)
    .some((column) => {
      const value = getValue(row, column);

      return String(value ?? "")
        .toLowerCase()
        .includes(keyword);
    });
}
