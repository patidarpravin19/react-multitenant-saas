import { ResourceListPage } from "../../shared/ResourceCrudPages";
import { productResource } from "./productResource";

export function ProductListPage() {
  return <ResourceListPage {...productResource} />;
}
