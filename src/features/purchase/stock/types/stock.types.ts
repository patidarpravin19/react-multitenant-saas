import type { ResourceRecord } from "../../../shared/resourceApi";

export interface StockItem extends ResourceRecord {
  productName: string;
  serialNumber: string;
  serialNumber1?: string | null;
  totalAmount: number;
  isSold: boolean;
  isActive: boolean;
  stockStatus: string;
}
