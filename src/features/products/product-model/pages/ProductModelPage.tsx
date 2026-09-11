import { useMemo, useState } from "react";
import { useNotifications } from "../../../../context/NotificationContext";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";
import { productModelColumns } from "../config/productModel.columns";
import { createProductModelFormConfig } from "../config/product-model.form";
import type { ProductModel } from "../types/productType.types";
import { ProductCrudLayout } from "../../shared/ProductCrudLayout";

const brands = [{ brandId: "Samsung", id: "type-mobile", name: "Mobile" }, { brandId: "LG", id: "type-tv", name: "TV" }];
const productTypes = [{ id: "type-mobile", name: "Mobile" }, { id: "type-tv", name: "TV" }];
const initialModels: ProductModel[] = [{
  id: "model-s25", productTypeId: "type-mobile",
  productTypeName: "Mobile", name: "Galaxy S25 FE", code: "S25-FE", 
  description: "Samsung Galaxy model", isActive: true, isDelete: false
}];

export function ProductModelPage() {
  const notifications = useNotifications();
  const [models, setModels] = useState(initialModels);
  const fields = useMemo(() => createProductModelFormConfig({ productTypes, brands }), []);
  const createProductModel = async (values: Record<string, unknown>) => {
    const productTypeId = String(values.productTypeId ?? "");
    const model: ProductModel = {
      id: crypto.randomUUID(),
      productTypeId,
      productTypeName: productTypes.find(type => type.id === productTypeId)?.name, name: String(values.name ?? ""),
      code: String(values.code ?? ""),
      description: String(values.description ?? ""),
      isActive: Boolean(values.isActive),
      isDelete: false
    };
    setModels(current => [model, ...current]);
    notifications.success("Product model created", `${model.name} was created successfully.`);
  };
  return <ProductCrudLayout title="Product Models" description="Manage product models." addButtonLabel="Add Product Model"
    form={
      <DynamicForm title="" fields={fields} onSubmit={createProductModel} />}>
    <DynamicGrid title="Product Model List" columns={productModelColumns}
      data={models.filter(model => !model.isDelete)} mode="client" getRowId={model => model.id} />
  </ProductCrudLayout>;
}
