// import { BaseMasterEntity } from "../../../../types/BaseMasterEntity";
import { BaseMaster } from "../../shared/master.types";


export interface ProductVariant extends BaseMaster {
  productModelId: string;
  productModelName?: string;
  ram: string;
  rom: string;
  processor: string;
}