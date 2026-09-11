export const APP_ROUTES = {
  dashboard: "/",

  products: {
    root:
      "/products",

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

    products: {
      list: "/products/list",
      add: "/products/add",
      edit: (id: string) => `/products/${id}/edit`,
    },
  },
} as const;
