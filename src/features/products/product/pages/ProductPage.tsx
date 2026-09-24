import { useMemo, useState } from "react";

import { DynamicForm } from "../../../dynamic-form/DynamicForm";

import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";

import { useNotifications } from "../../../../context/NotificationContext";

import { productColumns } from "../config/product.columns";

import { createProductFormConfig } from "../config/product.form";

import type { Product } from "../types/product.types";

import { ProductCrudLayout } from "../../shared/ProductCrudLayout";

export function ProductPage() {
  const mode = "server"; // Change to "client" for client-side mode
  const notifications = useNotifications();

  const [products, setProducts] = useState<Product[]>([]);

  const vendors = [
    {
      id: "vendor-a",
      name: "Vendor A",
    },

    {
      id: "vendor-b",
      name: "Vendor B",
    },
  ];

  const productTypes = [
    {
      id: "samsung",
      name: "Samsung",
    },

    {
      id: "lg",
      name: "LG",
    },

    {
      id: "sony",
      name: "Sony",
    },
  ];

  const categories = [
    {
      id: "galaxy-5",
      name: "Galaxy 5",
    },

    {
      id: "fe-6",
      name: "FE 6",
    },
  ];

  const variants = [
    {
      id: "8-128",
      name: "8 GB + 128 GB",
    },

    {
      id: "12-256",
      name: "12 GB + 256 GB",
    },
  ];

  const formConfig = useMemo(
    () =>
      createProductFormConfig({
        vendors,
        productTypes,
        categories,
        variants,
      }),
    [],
  );

  const saveProduct = async (values: Record<string, unknown>) => {
    const vendorId = String(values.vendorId ?? "");

    const productTypeId = String(values.productTypeId ?? "");

    const categoryId = String(values.categoryId ?? "");

    const variantId = String(values.variantId ?? "");

    const product: Product = {
      id: crypto.randomUUID(),
      name: String(values.serialNumber ?? ""),
      brandId: vendorId,
      productModelId: categoryId,
      vendorId,
      vendorName: vendors.find((x) => x.id === vendorId)?.name,
      productTypeId,
      productTypeName: productTypes.find((x) => x.id === productTypeId)?.name,
      categoryId,
      categoryName: categories.find((x) => x.id === categoryId)?.name,
      variantId,
      variantName: variants.find((x) => x.id === variantId)?.name,
      code: String(values.code ?? ""),
      uniqueNumber: String(values.emi ?? ""),
      uniqueNumber1: String(values.uniqueNumber1 ?? ""),
      serialNumber: String(values.serialNumber ?? ""),
      quantity: Number(values.quantity ?? 0),
      purchasePrice: Number(values.purchasePrice ?? 0),
      discount: Number(values.discount ?? 0),
      tax: Number(values.tax ?? 0),
      description: String(values.description ?? ""),
      isActive: Boolean(values.isActive),
      isDelete: false,
    };

    setProducts((current) => [product, ...current]);

    notifications.success(
      "Product created",
      "Product was created successfully.",
    );
  };

  const updateProduct = async ({
    rowId,
    values,
  }: {
    rowId: string;

    values: Record<string, unknown>;
  }) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === rowId
          ? ({
            ...product,
            ...values,
          } as Product)
          : product,
      ),
    );

    notifications.success(
      "Product updated",
      "Product information has been updated.",
    );
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = await notifications.confirm({
      title: "Delete product?",
      message: `Delete serial number ${product.serialNumber}?`,
      variant: "danger",
      confirmLabel: "Delete",
    });

    if (!confirmed) {
      return;
    }

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
            ...item,
            isDelete: true,
            isActive: false,
          }
          : item,
      ),
    );

    notifications.success(
      "Product deleted",
      "The product was deleted successfully.",
    );
  };

  return (
    <ProductCrudLayout
      title="Products"
      description="Manage inventory products, variants, pricing and stock."
      addButtonLabel="Add Product"
      form={<DynamicForm title="" fields={formConfig} onSubmit={saveProduct} />}
    >
      <DynamicGrid
        title="Product List"
        columns={productColumns}
        data={products}
        mode={mode}
        getRowId={(row) => row.id}
        inlineEdit={{
          enabled: true,
          editableFields: ["quantity", "purchasePrice", "discount", "tax"],
          validate: ({ values }) => {
            const errors: Record<string, string> = {};
            if (Number(values.quantity) < 0) {
              errors.quantity = "Quantity cannot be negative.";
            }
            if (Number(values.purchasePrice) < 0) {
              errors.purchasePrice = "Purchase price cannot be negative.";
            }
            return errors;
          },
          onSave: updateProduct,
        }}

        onView={(product) => {
          notifications.info(
            product.serialNumber,
            `${product.vendorName} • ${product.variantName}`,
          );
        }}

        onDelete={deleteProduct}
      />
    </ProductCrudLayout>
  );
}
