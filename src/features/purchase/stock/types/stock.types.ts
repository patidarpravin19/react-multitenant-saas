import type { ResourceRecord } from "../../../shared/resourceApi";

export interface StockItem extends ResourceRecord {
  productName: string;
  serialNumber: string;
  serialNumber1?: string | null;
  quantityOnHand: number;
  totalAmount: number;
  isSold: boolean;
  isActive: boolean;
  stockStatus: string;
}
