import type { ReactNode } from "react";

export type GridMode = "client" | "server";
export type GridSortDirection = "asc" | "desc";
export type GridDensity = "compact" | "comfortable" | "spacious";
export type GridAlign = "left" | "center" | "right";
export type GridFilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export interface GridSort {
  field: string;
  direction: GridSortDirection;
}

export interface GridColumnFilter {
  field: string;
  value: string;
  operator?: GridFilterOperator;
}

export interface GridQuery {
  pageIndex: number;
  pageSize: number;
  search: string;
  sort: GridSort[];
  filters: GridColumnFilter[];
}

export interface GridResult<TData> {
  rows: TData[];
  totalCount: number;
}

export interface GridOption {
  label: string;
  value: string;
}

export interface GridCellContext<TData> {
  row: TData;
  value: unknown;
  rowIndex: number;
}

export interface GridColumn<TData> {
  id: string;
  header: string;
  accessor?: keyof TData;
  valueGetter?: (row: TData) => unknown;
  cell?: (context: GridCellContext<TData>) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  filterOperator?: GridFilterOperator;
  filterOptions?: GridOption[];
  align?: GridAlign;
  width?: number;
  minWidth?: number;
  hidden?: boolean;
  exportable?: boolean;
}

export interface GridServerSource<TData> {
  load: (query: GridQuery, signal?: AbortSignal) => Promise<GridResult<TData>>;
}

export interface DynamicGridProps<TData> {
  title?: string;
  description?: string;
  columns: GridColumn<TData>[];
  mode?: GridMode;
  data?: TData[];
  serverSource?: GridServerSource<TData>;
  getRowId: (row: TData) => string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  initialSort?: GridSort[];
  initialSearch?: string;
  searchable?: boolean;
  selectable?: boolean;
  showColumnFilters?: boolean;
  showColumnVisibility?: boolean;
  showDensity?: boolean;
  showExport?: boolean;
  stickyHeader?: boolean;
  onRowClick?: (row: TData) => void;
  onSelectionChange?: (rows: TData[]) => void;
  emptyMessage?: string;
}
