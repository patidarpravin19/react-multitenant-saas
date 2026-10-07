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
  ShoppingCart,
  Receipt,
  Users,
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
      }
    ],
  },
  {
    id: "purchase",
    label: "Purchase",
    icon: ShoppingCart,
    children: [
      {
        id: "product-list",
        label: "Products",
        path: APP_ROUTES.purchase.products.list,
        icon: Boxes,
      },
      {
        id: "stock-inventory",
        label: "Stock Inventory",
        path: APP_ROUTES.purchase.stock,
        icon: Boxes,
      },
      {
        id: "purchase-accounting",
        label: "Bills & Payments",
        path: APP_ROUTES.purchase.accounting,
        icon: HandCoins,
      },
    ],
  },
  {
    id: "sale",
    label: "Sale",
    icon: Receipt,
    children: [
      {
        id: "sale-products",
        label: "Products",
        path: APP_ROUTES.sale.products.list,
        icon: Boxes,
      },
      {
        id: "sale-customers",
        label: "Customers",
        path: APP_ROUTES.sale.customers.list,
        icon: Users,
      },
      {
        id: "sales-accounting",
        label: "Bills & Payments",
        path: APP_ROUTES.sale.accounting,
        icon: HandCoins,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    children: [
      {
        id: "tax",
        label: "Tax",
        path: APP_ROUTES.settings.tax.list,
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
