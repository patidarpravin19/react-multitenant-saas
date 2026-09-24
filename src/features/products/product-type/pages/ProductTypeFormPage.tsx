import { ResourceFormPage } from "../../shared/ResourceCrudPages";
import { productTypeResource } from "./productTypeResource";

export function ProductTypeFormPage({ mode }: { mode: "create" | "edit" }) {
  return <ResourceFormPage {...productTypeResource} mode={mode} />;
}
