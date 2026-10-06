import type { ResourceRecord } from "../../../shared/resourceApi";

export interface SaleRecord extends ResourceRecord {
  productId: string;
  productName: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  customerEmail?: string | null;
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
  totalAmount?: number;
  discount?: number;
  isActive?: boolean;
}


// Guid Id, string BrandName, string ProductType, string ProductModel, string Variant,
// string Color, string SerialNumber, string SerialNumber1, decimal PurchasePrice, decimal Discount);
