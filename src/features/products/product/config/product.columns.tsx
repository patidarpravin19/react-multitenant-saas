import type { GridColumn } from "../../../../types/grid";

import type { Product } from "../types/product.types";

export const productColumns: GridColumn<Product>[] = [
  {
    id: "vendorName",
    header: "Vendor",
    accessor: "vendorName",
    searchable: true,
    sortable: true,
  },
  {
    id: "productTypeName",
    header: "Type",
    accessor: "productTypeName",
    searchable: true,
    sortable: true,
  },
  {
    id: "categoryName",
    header: "Category",
    accessor: "categoryName",
    searchable: true,
  },
  {
    id: "variantName",
    header: "Variant",
    accessor: "variantName",
    searchable: true,
  },
  {
    id: "serialNumber",
    header: "Serial Number",
    accessor: "serialNumber",
    searchable: true,
  },
  {
    id: "quantity",
    header: "Qty",
    accessor: "quantity",
    sortable: true,
    editable: true,
    editor: "number",
  },

  {
    id: "purchasePrice",
    header: "Purchase Price",
    accessor: "purchasePrice",
    sortable: true,
    editable: true,
    editor: "number",

    cell: (_, row) =>
      `₹${row.purchasePrice?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
  },

  {
    id: "discount",
    header: "Discount",
    accessor: "discount",
    editable: true,
    editor: "number",
  },

  {
    id: "tax",
    header: "Tax %",
    accessor: "tax",
    editable: true,
    editor: "number",
  },

  {
    id: "isActive",
    header: "Status",
    accessor: "isActive",

    cell: (_, row) => (
      <span
        className={
          row.isActive
            ? `
              rounded-full
              bg-emerald-100
              px-2.5
              py-1
              text-xs
              font-semibold
              text-emerald-700

              dark:bg-emerald-900/30
              dark:text-emerald-300
            `
            : `
              rounded-full
              bg-slate-100
              px-2.5
              py-1
              text-xs
              text-slate-600

              dark:bg-slate-800
              dark:text-slate-300
            `
        }
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
];
