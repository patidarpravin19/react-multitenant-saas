import type { ResourceRecord } from "../../../shared/resourceApi";

export interface SaleRecord extends ResourceRecord {
  billNumber: string;
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
  taxId?: string | null;
  cgstRate?: number;
  sgstRate?: number;
  totalAmount?: number;
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
  cgst?: number;
  sgst?: number;
  discount?: number;
  isActive?: boolean;
}

export interface CustomerLookupRecord extends ResourceRecord {
  name: string;
  mobile: string;
  address: string;
  email?: string | null;
}


// Guid Id, string BrandName, string ProductType, string ProductModel, string Variant,
// string Color, string SerialNumber, string SerialNumber1, decimal PurchasePrice, decimal Discount);
