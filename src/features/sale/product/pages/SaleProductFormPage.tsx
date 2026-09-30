import { ResourceFormPage } from "../../../shared/ResourceCrudPages";
import { saleResource } from "./saleResource";

export function SaleProductFormPage({ mode }: { mode: "create" | "edit" }) {
  return <ResourceFormPage {...saleResource} mode={mode} />;
}
