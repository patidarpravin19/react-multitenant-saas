import { BaseMaster } from "../../shared/master.types";

export interface ProductModel extends BaseMaster { 
  productTypeId: string;
  productTypeName?: string;
}