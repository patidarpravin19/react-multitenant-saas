import { BaseMasterEntity } from "../../../../types/BaseMasterEntity";
import { BaseMaster } from "../../shared/master.types";


// Galaxy 5
// FE 6

export interface ProductCategory extends BaseMasterEntity {
    name: string;
    description: string;
}
