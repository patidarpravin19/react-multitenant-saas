import {
  Boxes,
  Factory,
  HandCoins,
  FolderTree,
  LayoutDashboard,
  Palette,
  Package,
  Shapes,
  Settings as SettingsIcon,
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

        path: APP_ROUTES.products.vendors.list,

        icon: Truck,
      },

      {
        id: "brands",

        label: "Brands",

        path: APP_ROUTES.products.brands.list,

        icon: Factory,
      },

      {
        id: "product-types",

        label: "Product Types",

        path: APP_ROUTES.products.types.list,

        icon: Shapes,
      },

      {
        id: "product-models",

        label: "Categories / Models",

        path: APP_ROUTES.products.models.list,

        icon: FolderTree,
      },

      {
        id: "variants",

        label: "Variants",

        path: APP_ROUTES.products.variants.list,

        icon: Tags,
      },

      {
        id: "colors",
        label: "Colors",
        path: APP_ROUTES.products.colors.list,
        icon: Palette,
      },

      {
        id: "product-list",

        label: "Products",

        path: APP_ROUTES.products.products.list,

        icon: Boxes,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    children: [
      {
        id: "gst",
        label: "GST",
        path: APP_ROUTES.settings.gst.list,
        icon: Tags,
      },
      {
        id: "finance-vendors",
        label: "Finance Vendors",
        path: APP_ROUTES.settings.financeVendors.list,
        icon: HandCoins,
      },
    ],
  },
];
