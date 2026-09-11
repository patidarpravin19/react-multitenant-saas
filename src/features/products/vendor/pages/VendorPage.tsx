import {
    useState,
} from "react";

import { DynamicForm } from "../../../dynamic-form/DynamicForm";
import { DynamicGrid } from "../../../dynamic-grid/DynamicGrid";

import {
    useNotifications,
} from "../../../../context/NotificationContext";

import {
    vendorColumns,
} from "../config/vendor.columns";

import {
    vendorFormConfig,
} from "../config/vendor.form";

import type {
    Vendor,
} from "../types/vendor.types";

import {
    ProductCrudLayout,
} from "../../shared/ProductCrudLayout";

const initialVendors: Vendor[] = [
    {
        id: "1",

        name: "Vendor A",

        code: "VEN-A",

        description:
            "Primary Samsung distributor",

        address:
            "Indore, Madhya Pradesh",

        mobile:
            "9876543210",

        email:
            "vendora@example.com",

        isActive:
            true,

        isDelete:
            false,
    },

    {
        id: "2",

        name:
            "Vendor B",

        code:
            "VEN-B",

        description:
            "Electronics distributor",

        address:
            "Bhopal, Madhya Pradesh",

        mobile:
            "9123456789",

        email:
            "vendorb@example.com",

        isActive:
            true,

        isDelete:
            false,
    },
];

export function VendorPage() {
    const notifications =
        useNotifications();

    const [vendors, setVendors] =
        useState<Vendor[]>(
            initialVendors,
        );

    const createVendor =
        async (
            values: Record<
                string,
                unknown
            >,
        ) => {
            const vendor: Vendor = {
                id:
                    crypto.randomUUID(),

                name:
                    String(
                        values.name ?? "",
                    ),

                code:
                    String(
                        values.code ?? "",
                    ),

                description:
                    String(
                        values.description ??
                        "",
                    ),

                address:
                    String(
                        values.address ?? "",
                    ),

                mobile:
                    String(
                        values.mobile ?? "",
                    ),

                email:
                    String(
                        values.email ?? "",
                    ),

                isActive:
                    Boolean(
                        values.isActive,
                    ),

                isDelete:
                    false,
            };

            setVendors(current => [
                vendor,
                ...current,
            ]);

            notifications.success(
                "Vendor created",
                `${vendor.name} was created successfully.`,
            );
        };

    const updateVendor =
        async ({
            rowId,
            values,
        }: {
            rowId: string;

            values: Record<
                string,
                unknown
            >;
        }) => {
            setVendors(current =>
                current.map(item =>
                    item.id === rowId
                        ? {
                            ...item,
                            ...values,
                        } as Vendor
                        : item,
                ),
            );

            notifications.success(
                "Vendor updated",
                "Vendor was updated successfully.",
            );
        };

    const deleteVendor =
        async (
            vendor: Vendor,
        ) => {
            const confirmed =
                await notifications.confirm(
                    {
                        title:
                            "Delete vendor?",

                        message:
                            `Are you sure you want to delete ${vendor.name}?`,

                        variant:
                            "danger",

                        confirmLabel:
                            "Delete",

                        cancelLabel:
                            "Cancel",
                    },
                );

            if (!confirmed) {
                return;
            }

            setVendors(current =>
                current.map(item =>
                    item.id === vendor.id
                        ? {
                            ...item,

                            isDelete:
                                true,

                            isActive:
                                false,
                        }
                        : item,
                ),
            );

            notifications.success(
                "Vendor deleted",
                `${vendor.name} has been deleted.`,
            );
        };

    const visibleVendors =
        vendors.filter(
            item => !item.isDelete,
        );

    return (
        <ProductCrudLayout
            title="Vendors"
            description="Manage product vendors and suppliers."
            addButtonLabel="Add Vendor"

            form={
                <DynamicForm
                    title=""
                    fields={
                        vendorFormConfig
                    }
                    onSubmit={
                        createVendor
                    }
                />
            }
        >
            <DynamicGrid
                title="Vendor List"

                columns={
                    vendorColumns
                }

                data={
                    visibleVendors
                }

                mode="client"

                getRowId={
                    row => row.id
                }

                inlineEdit={{
                    enabled:
                        true,

                    editableFields: [
                        "name",
                        "code",
                        "mobile",
                        "email",
                        "address",
                    ],

                    validate: ({
                        values,
                    }) => {
                        const errors: Record<
                            string,
                            string
                        > = {};

                        if (
                            !String(
                                values.name ??
                                "",
                            ).trim()
                        ) {
                            errors.name =
                                "Vendor name is required.";
                        }

                        if (
                            !String(
                                values.code ??
                                "",
                            ).trim()
                        ) {
                            errors.code =
                                "Vendor code is required.";
                        }

                        return errors;
                    },

                    onSave:
                        updateVendor,
                }}

                onView={
                    vendor => {
                        notifications.info(
                            vendor.name,
                            `${vendor.code} • ${vendor.email}`,
                        );
                    }
                }

                onDelete={
                    deleteVendor
                }
            />
        </ProductCrudLayout>
    );
}