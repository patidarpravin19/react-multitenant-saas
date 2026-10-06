import type { GridColumn } from "../../../../types/grid";

import type { Product } from "../types/product.types";

export const productColumns: GridColumn<Product>[] = [
  {
    id: "vendorName",
    header: "Vendor",
    accessor: "vendorName",
    searchable: true,
    sortable: true,
    hidden: true,
  },
  {
    id: "productTypeName",
    header: "Type",
    accessor: "productTypeName",
    searchable: true,
    sortable: true,
    hidden: true,
  },
  {
    id: "productModelName",
    header: "Model",
    accessor: "productModelName",
    searchable: true,
  },
  {
    id: "variantName",
    header: "Variant",
    accessor: "variantName",
    searchable: true,
  },
  {
    id: "colorName",
    header: "Color",
    accessor: "colorName",
    searchable: true,
  },
  {
    id: "serialNumber",
    header: "Serial Number",
    accessor: "serialNumber",
    searchable: true,
  },
  {
    id: "serialNumber1",
    header: "Serial Number 1",
    accessor: "serialNumber1",
    searchable: true,
  },
  {
    id: "purchasePrice",
    header: "Purchase Price",
    accessor: "purchasePrice",
    align: "right",
    sortable: true,
    editable: true,
    editor: "number",

    cell: (_, row) =>
      `₹${row.purchasePrice?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
  },
  {
    id: "totalAmount",
    header: "Total Amount",
    accessor: "totalAmount",
    align: "right",
    sortable: true,
    cell: (_, row) =>
      `₹${row.totalAmount?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },

  {
    id: "discount",
    header: "Discount",
    accessor: "discount",
    editable: true,
    editor: "number",
    hidden: true,
  },

  {
    id: "tax",
    header: "Tax %",
    accessor: "tax",
    editable: true,
    editor: "number",
    hidden: true,
  },
  {
    id: "cgst",
    header: "CGST %",
    accessor: "cgst",
    editable: true,
    editor: "number",
    hidden: true,
  },
  {
    id: "sgst",
    header: "SGST %",
    accessor: "sgst",
    editable: true,
    editor: "number",
    hidden: true,
  },

  {
    id: "isSold",
    header: "Status",
    accessor: "isSold",

    cell: (_, row) => (
      <span
        className={
          row.isSold
            ? `
              rounded-full
              bg-blue-100
              px-2.5
              py-1
              text-xs
              font-semibold
              text-blue-700

              dark:bg-blue-900/30
              dark:text-blue-300
            `
            : !row.isActive ? `
              rounded-full
              bg-slate-100
              px-2.5
              py-1
              text-xs
              text-slate-600

              dark:bg-slate-800
              dark:text-slate-300
            ` : `
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
        }
      >
        {row.isSold ? "Sold" : row.isActive ? "Available" : "Inactive"}
      </span>
    ),
  },
];
