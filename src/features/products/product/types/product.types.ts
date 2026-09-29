import { BaseMaster } from "../../shared/master.types";

export interface Product extends BaseMaster {
  vendorId: string;
  vendorName?: string;
  productTypeId: string;
  productTypeName?: string;
  categoryId: string;
  categoryName?: string;
  variantId: string;
  variantName?: string;
  brandId: string;
  brandName?: string;
  productModelId: string;
  productModelName?: string;
  colorId: string;
  colorName?: string;
  code: string;
  uniqueNumber: string;
  uniqueNumber1: string;
  serialNumber1: string;
  serialNumber: string;
  quantity: number;
  purchasePrice: number;
  discount: number;
  cgst: number;
  sgst: number;
  tax: number;
  description: string;
}
