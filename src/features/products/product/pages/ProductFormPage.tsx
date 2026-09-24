import { ResourceFormPage } from "../../shared/ResourceCrudPages";
import { productResource } from "./productResource";

export function ProductFormPage({ mode }: { mode: "create" | "edit" }) {
  return <ResourceFormPage {...productResource} mode={mode} />;
}
