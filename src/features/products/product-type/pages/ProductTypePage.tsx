import { useMemo, useState } from "react";
import { useNotifications } from "../../../../context/NotificationContext";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";
import { productTypeColumns } from "../config/productType.columns";
import { createProductTypeFormConfig } from "../config/productType.form";
import type { ProductType } from "../types/productType.types";
import { ProductCrudLayout } from "../../shared/ProductCrudLayout";

const vendors = [
  { id: "vendor-a", name: "Vendor A" },
  { id: "vendor-b", name: "Vendor B" },
];
const brands = [
  { id: "brand-samsung", name: "Samsung" },
  { id: "brand-lg", name: "LG" },
];
const initialProductTypes: ProductType[] = [
  {
    id: "type-mobile",
    vendorId: "vendor-a",
    brandId: "brand-samsung",
    brandName: "Samsung",
    name: "Mobile",
    code: "MOBILE",
    description: "Mobile phones",
    isActive: true,
    isDelete: false,
  },
];

export function ProductTypePage() {
  const mode = "server"; // Change to "client" for client-side mode
  const notifications = useNotifications();
  const [productTypes, setProductTypes] = useState(initialProductTypes);
  const fields = useMemo(
    () => createProductTypeFormConfig({ vendors, brands }),
    [],
  );
  const createProductType = async (values: Record<string, unknown>) => {
    const vendorId = String(values.vendorId ?? "");
    const brandId = String(values.brandId ?? "");
    const productType: ProductType = {
      id: crypto.randomUUID(),
      vendorId,
      brandId,
      brandName: brands.find((brand) => brand.id === brandId)?.name,
      name: String(values.name ?? ""),
      code: String(values.code ?? ""),
      description: String(values.description ?? ""),
      isActive: Boolean(values.isActive),
      isDelete: false,
    };
    setProductTypes((current) => [productType, ...current]);
    notifications.success(
      "Product type created",
      `${productType.name} was created successfully.`,
    );
  };
  return (
    <ProductCrudLayout
      title="Product Types"
      description="Manage product classifications."
      addButtonLabel="Add Product Type"
      form={
        <DynamicForm title="" fields={fields} onSubmit={createProductType} />
      }
    >
      <DynamicGrid
        title="Product Type List"
        columns={productTypeColumns}
        data={productTypes.filter((type) => !type.isDelete)}
        mode={mode}
        getRowId={(type) => type.id}
      />
    </ProductCrudLayout>
  );
}
