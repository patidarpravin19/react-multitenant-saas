import { BaseMaster } from "../../shared/master.types";

export interface Brand extends BaseMaster {
  vendorId: string;
  vendorName?: string;
}
