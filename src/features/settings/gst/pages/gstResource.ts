import { APP_ROUTES } from "../../../../config/routes";
import { gstColumns } from "../config/gst.columns";
import { gstFormConfig } from "../config/gst.form";
import type { GstRate } from "../types/gst.types";
import { createResourceApi } from "../../../products/shared/resourceApi";

export const gstResource = {
  title: "GST",
  description: "Manage CGST and SGST rates.",
  singular: "GST Rate",
  listPath: APP_ROUTES.settings.gst.list,
  addPath: APP_ROUTES.settings.gst.add,
  editPath: APP_ROUTES.settings.gst.edit,
  columns: gstColumns,
  fields: gstFormConfig,
  api: createResourceApi<GstRate>("/gst"),
};
