import type { GridColumn } from "../../../../types/grid";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../../config/routes";
import type { SaleRecord } from "../types/sale.types";

const currency = (value: number) =>
  `₹${value?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export const saleColumns: GridColumn<SaleRecord>[] = [
  {
    id: "productName",
    header: "Product",
    accessor: "productName",
    searchable: true,
    sortable: true,
    cell: (value) => (
      <span className="block max-w-64 truncate" title={String(value ?? "")}>
        {String(value ?? "—")}
      </span>
    ),
  },
  {
    id: "serialNumber",
    header: "Serial Number",
    accessor: "serialNumber",
    searchable: true,
    cell: (value) => (
      <span className="block max-w-48 truncate" title={String(value ?? "")}>
        {String(value ?? "—")}
      </span>
    ),
  },
  { id: "customerName", header: "Customer", accessor: "customerName", searchable: true, sortable: true },
  { id: "customerMobile", header: "Mobile", accessor: "customerMobile", searchable: true },
  { id: "saleDate", header: "Sale Date", accessor: "saleDate", sortable: true },
  { id: "productPrice", header: "Product Price", accessor: "productPrice", cell: (_, row) => currency(row.productPrice) },
  { id: "sellingPrice", header: "Selling Price", accessor: "sellingPrice", sortable: true, cell: (_, row) => currency(row.sellingPrice) },
  { id: "discount", header: "Discount", accessor: "discount", cell: (_, row) => currency(row.discount) },
  { id: "paymentMode", header: "Payment Mode", accessor: "paymentMode", cell: (value) => String(value ?? "Not recorded") },
  {
    id: "paymentDetails",
    header: "Payment Details",
    accessor: "paymentMode",
    cell: (_, row) => (
      <Link
        to={APP_ROUTES.sale.products.payment(row.id)}
        className="font-medium text-[var(--tenant-primary)] hover:underline"
      >
        {row.paymentMode ? "Edit payment" : "Add payment"}
      </Link>
    ),
  },
];
