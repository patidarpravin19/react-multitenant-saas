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
  paymentMode?: "Cash" | "Finance" | null;
}

export interface SaleProductOption extends ResourceRecord {
  brand: string;
  productType: string;
  productModel: string;
  variant: string;
  color: string;
  serialNumber?: string;
  serialNumber1?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  Discount?: number;
  isActive?: boolean;
}


// Guid Id, string BrandName, string ProductType, string ProductModel, string Variant,
// string Color, string SerialNumber, string SerialNumber1, decimal PurchasePrice, decimal Discount);
