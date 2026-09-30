import type { GridColumn } from "../../../../types/grid";
import type { SaleRecord } from "../types/sale.types";

const currency = (value: number) =>
  `₹${value?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export const saleColumns: GridColumn<SaleRecord>[] = [
  { id: "productName", header: "Product", accessor: "productName", searchable: true, sortable: true },
  { id: "serialNumber", header: "Serial Number", accessor: "serialNumber", searchable: true },
  { id: "customerName", header: "Customer", accessor: "customerName", searchable: true, sortable: true },
  { id: "customerMobile", header: "Mobile", accessor: "customerMobile", searchable: true },
  { id: "saleDate", header: "Sale Date", accessor: "saleDate", sortable: true },
  { id: "productPrice", header: "Product Price", accessor: "productPrice", cell: (_, row) => currency(row.productPrice) },
  { id: "sellingPrice", header: "Selling Price", accessor: "sellingPrice", sortable: true, cell: (_, row) => currency(row.sellingPrice) },
  { id: "discount", header: "Discount", accessor: "discount", cell: (_, row) => currency(row.discount) },
];
