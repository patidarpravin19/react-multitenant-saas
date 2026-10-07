import type { ResourceRecord } from "../../../shared/resourceApi";

export interface SalesBill extends ResourceRecord {
  billNumber: string;
  productName: string;
  customerName: string;
  customerMobile: string;
  billDate: string;
  sellingPrice: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: "Paid" | "Partially paid" | "Unpaid" | string;
}

export interface SalesReceipt {
  id: string;
  amount: number;
  paymentMode: string;
  paymentDate: string;
  referenceNumber?: string | null;
  note?: string | null;
}

export interface SalesBillDetails {
  bill: SalesBill;
  payments: SalesReceipt[];
}
