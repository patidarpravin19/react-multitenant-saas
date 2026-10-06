import type { GridColumn } from "../../../../types/grid";
import type { StockItem } from "../types/stock.types";

const currency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const stockColumns: GridColumn<StockItem>[] = [
  { id: "productName", header: "Product", accessor: "productName", searchable: true, sortable: true },
  { id: "serialNumber", header: "Serial Number", accessor: "serialNumber", searchable: true, sortable: true },
  { id: "serialNumber1", header: "Serial Number 1", accessor: "serialNumber1", searchable: true },
  { id: "totalAmount", header: "Unit Cost", accessor: "totalAmount", sortable: true, cell: (_, row) => currency(row.totalAmount) },
  {
    id: "stockStatus",
    header: "Status",
    accessor: "stockStatus",
    sortable: true,
    cell: (_, row) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.stockStatus === "In stock"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        : row.stockStatus === "Sold"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
        {row.stockStatus}
      </span>
    ),
  },
];
