import { ResourceFormPage } from "../../../products/shared/ResourceCrudPages";
import { gstResource } from "./gstResource";

export function GstFormPage({ mode }: { mode: "create" | "edit" }) {
  return <ResourceFormPage {...gstResource} mode={mode} />;
}
