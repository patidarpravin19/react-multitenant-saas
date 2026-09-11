import { useMemo, useState } from "react";
import { useNotifications } from "../../../../context/NotificationContext";
import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";
import { variantColumns } from "../config/variant.columns";
import { createVariantFormConfig } from "../config/variant.form";
import type { ProductVariant } from "../types/variant.types";
import { ProductCrudLayout } from "../../shared/ProductCrudLayout";

const models = [{ id: "model-s25", name: "Galaxy S25 FE" }, { id: "model-oled", name: "OLED C4" }];
const initialVariants: ProductVariant[] = [{ id: "variant-s25-128", productModelId: "model-s25", productModelName: "Galaxy S25 FE", name: "8 GB + 128 GB", code: "8-128", ram: "8 GB", rom: "128 GB", processor: "Snapdragon 8 Gen 3", description: "Base storage variant", isActive: true, isDelete: false }];

export function VariantPage() {
  const notifications = useNotifications();
  const [variants, setVariants] = useState(initialVariants);
  const fields = useMemo(() => createVariantFormConfig({ models }), []);
  const createVariant = async (values: Record<string, unknown>) => {
    const productModelId = String(values.productModelId ?? "");
    const variant: ProductVariant = { id: crypto.randomUUID(), productModelId, productModelName: models.find(model => model.id === productModelId)?.name, name: String(values.name ?? ""), code: String(values.code ?? ""), ram: String(values.ram ?? ""), rom: String(values.rom ?? ""), processor: String(values.processor ?? ""), description: String(values.description ?? ""), isActive: Boolean(values.isActive), isDelete: false };
    setVariants(current => [variant, ...current]);
    notifications.success("Variant created", `${variant.name} was created successfully.`);
  };
  return <ProductCrudLayout title="Variants" description="Manage product variants and specifications." addButtonLabel="Add Variant" form={<DynamicForm title="" fields={fields} onSubmit={createVariant} />}><DynamicGrid title="Variant List" columns={variantColumns} data={variants.filter(variant => !variant.isDelete)} mode="client" getRowId={variant => variant.id} /></ProductCrudLayout>;
}
