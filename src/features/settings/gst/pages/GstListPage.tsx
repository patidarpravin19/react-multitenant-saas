import { ResourceListPage } from "../../../products/shared/ResourceCrudPages";
import { gstResource } from "./gstResource";

export function GstListPage() {
  return <ResourceListPage {...gstResource} />;
}
