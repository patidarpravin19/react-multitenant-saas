// import type {
//   BaseMasterEntity,
// } from "../../shared/base.types";

import { BaseMasterEntity } from "../../../../types/BaseMasterEntity";

export interface Vendor extends BaseMasterEntity {
  name: string;
  code: string;
  description: string;
  address: string;
  mobile: string;
  email: string;
}
