import {
    Boxes,
    Factory,
    FolderTree,
    LayoutDashboard,
    Package,
    Shapes,
    Tags,
    Truck,
} from "lucide-react";

import type { NavigationItem } from "../types/navigation";
import { APP_ROUTES } from "./routes";

export const sidebarConfiguration: NavigationItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: APP_ROUTES.dashboard,
        icon: LayoutDashboard,
    },

    {
        id: "products",

        label: "Product",

        icon: Package,

        children: [
            {
                id: "vendors",

                label: "Vendors",

                path:
                    APP_ROUTES
                        .products
                        .vendors.list,

                icon: Truck,
            },

            {
                id: "brands",

                label: "Brands",

                path:
                    APP_ROUTES
                        .products
                        .brands.list,

                icon: Factory,
            },

            {
                id:
                    "product-types",

                label:
                    "Product Types",

                path:
                    APP_ROUTES
                        .products
                        .types.list,

                icon: Shapes,
            },

            {
                id:
                    "product-models",

                label:
                    "Categories / Models",

                path:
                    APP_ROUTES
                        .products
                        .models.list,

                icon:
                    FolderTree,
            },

            {
                id: "variants",

                label: "Variants",

                path:
                    APP_ROUTES
                        .products
                        .variants.list,

                icon: Tags,
            },

            {
                id:
                    "product-list",

                label:
                    "Products",

                path:
                    APP_ROUTES
                        .products
                        .products.list,

                icon: Boxes,
            },
        ],
    },
];
