import { apiClient } from "../../../../services/apiClient";
import type { Vendor } from "../types/vendor.types";

export type SaveVendorInput = Omit<
  Vendor,
  "id" | "isDelete" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

export const vendorApi = {
  list: () => apiClient.get<Vendor[]>("/vendors"),
  getById: (id: string) =>
    apiClient.get<Vendor>(`/vendors/${encodeURIComponent(id)}`),
  create: (vendor: SaveVendorInput) =>
    apiClient.post<Vendor>("/vendors", vendor),
  update: (id: string, vendor: SaveVendorInput) =>
    apiClient.put<Vendor>(`/vendors/${encodeURIComponent(id)}`, vendor),
};
