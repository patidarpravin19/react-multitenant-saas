export const APP_ROUTES = {
  dashboard: "/",

  products: {
    root: "/products",

    vendors: {
      list: "/products/vendors/list",
      add: "/products/vendors/add",
      edit: (id: string) => `/products/vendors/${id}/edit`,
    },

    brands: {
      list: "/products/brands/list",
      add: "/products/brands/add",
      edit: (id: string) => `/products/brands/${id}/edit`,
    },

    types: {
      list: "/products/types/list",
      add: "/products/types/add",
      edit: (id: string) => `/products/types/${id}/edit`,
    },

    models: {
      list: "/products/models/list",
      add: "/products/models/add",
      edit: (id: string) => `/products/models/${id}/edit`,
    },

    variants: {
      list: "/products/variants/list",
      add: "/products/variants/add",
      edit: (id: string) => `/products/variants/${id}/edit`,
    },

    colors: {
      list: "/products/colors/list",
      add: "/products/colors/add",
      edit: (id: string) => `/products/colors/${id}/edit`,
    },
  },

  purchase: {
    stock: "/purchase/stock",
    accounting: "/purchase/accounting",
    accountingPayment: "/purchase/accounting/payments",
    stockProducts: (brandId: string, modelId: string, variantId: string) =>
      `/purchase/stock/${brandId}/${modelId}/${variantId}`,
    products: {
      list: "/purchase/products/list",
      add: "/purchase/products/add",
      bulkUpdate: "/purchase/products/bulk-update",
      edit: (id: string) => `/purchase/products/${id}/edit`,
    },
  },

  sale: {
    accounting: "/sales/accounting",
    products: {
      list: "/sales/products/list",
      add: "/sales/products/add",
      edit: (id: string) => `/sales/products/${id}/edit`,
      payment: (id: string) => `/sales/products/${id}/payment`,
    },
    accountingPayment: (id: string) => `/sales/accounting/payments/${id}`,
  },

  settings: {
    tax: {
      list: "/settings/taxes/list",
      add: "/settings/taxes/add",
      edit: (id: string) => `/settings/taxes/${id}/edit`,
    },
    financeVendors: {
      list: "/settings/finance-vendors/list",
      add: "/settings/finance-vendors/add",
      edit: (id: string) => `/settings/finance-vendors/${id}/edit`,
    },
  },
} as const;
