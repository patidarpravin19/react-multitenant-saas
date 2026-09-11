import { useMemo, useState } from "react";
import { useNotifications } from "../../../../context/NotificationContext";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";
import { brandColumns } from "../config/brand.columns";
import { createBrandFormConfig } from "../config/brand.form";
import type { Brand } from "../types/brand.types";
import { ProductCrudLayout } from "../../shared/ProductCrudLayout";

const vendors = [{ id: "vendor-a", name: "Vendor A" }, { id: "vendor-b", name: "Vendor B" }];
const initialBrands: Brand[] = [{ id: "brand-samsung", vendorId: "vendor-a", vendorName: "Vendor A", name: "Samsung", code: "SAM", description: "Mobile and electronics brand", isActive: true, isDelete: false }];

export function BrandPage() {
  const notifications = useNotifications();
  const [brands, setBrands] = useState(initialBrands);
  const fields = useMemo(() => createBrandFormConfig({ vendors }), []);
  const createBrand = async (values: Record<string, unknown>) => {
    const vendorId = String(values.vendorId ?? "");
    const brand: Brand = { id: crypto.randomUUID(), vendorId, vendorName: vendors.find(vendor => vendor.id === vendorId)?.name, name: String(values.name ?? ""), code: String(values.code ?? ""), description: String(values.description ?? ""), isActive: Boolean(values.isActive), isDelete: false };
    setBrands(current => [brand, ...current]);
    notifications.success("Brand created", `${brand.name} was created successfully.`);
  };
  return <ProductCrudLayout title="Brands" description="Manage product brands." addButtonLabel="Add Brand" form={<DynamicForm title="" fields={fields} onSubmit={createBrand} />}><DynamicGrid title="Brand List" columns={brandColumns} data={brands.filter(brand => !brand.isDelete)} mode="client" getRowId={brand => brand.id} /></ProductCrudLayout>;
}
