import type { ResourceRecord } from "../../../shared/resourceApi";

export interface SaleRecord extends ResourceRecord {
  productId: string;
  productName: string;
  serialNumber: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  saleDate: string;
  productPrice: number;
  sellingPrice: number;
  discount: number;
}

export interface SaleProductOption extends ResourceRecord {
  name: string;
  serialNumber?: string;
  serialNumber1?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  isActive?: boolean;
}
