export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    VERIFY_RESET_CODE: "/api/auth/verify-reset-code",
    RESET_PASSWORD: `/api/auth/reset-password`,
    DELETEME: "/api/auth/me",
  },
  PRODUCT: {
    CREATE: "/api/products/",
    GET_ALL: "/api/products/",
    GET_ONE: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,

    UPDATE_IMAGE: "/api/products/update-image",

    BY_CATEGORY: (category: string) =>
      `/api/products/category/${encodeURIComponent(category)}`,

    RECENT: "/api/products/recent",
    TRENDING: "/api/products/trending",
    POPULAR: "/api/products/popular",
    TOP_RATED: "/api/products/top-rated",
    OUT_OF_STOCK: "/api/products/out-of-stock",
    FAVORITES_ME: "/api/products/favorites/me",
    RESTOCK: (id: string) => `/api/products/${id}/restock`,
    INCREMENT_VIEW: (id: string) => `/api/products/${id}/view`,

    RATE: (id: string) => `/api/products/${id}/rate`,
    FAVORITE_TOGGLE: (id: string) => `/api/products/${id}/favorite`,
    ADD_COMMENT: (id: string) => `/api/products/${id}/comment`,
    GET_COMMENTS: (id: string) => `/api/products/${id}/comments`,
  },

  ADMIN: {
    USER: {
      CREATE: "/api/admin/users/",
      GETALLUSER: "/api/admin/users/",
      DELETEUSER: (id: string) => `/api/admin/users/${id}`,
    },
    ANALYTICS: {
      KPIS: "/api/admin/analytics/kpis",
      EARNINGS: "/api/admin/analytics/earnings",
      CATEGORY_SHARE: "/api/admin/analytics/category-share", // ?from=&to=
      TOP_PRODUCTS: "/api/admin/analytics/top-products",
      DRIVERS: "/api/admin/analytics/drivers",
      TOP_VIEWED_PRODUCTS: "/api/admin/analytics/topView",
    },
  },
  DRIVER: {
    GET_ALL: "/api/driver/stats",

    GET_STATS: "/api/driver/stats", // same thing (you can keep only one)
    GET_ONE_STATS: (id: string) => `/api/driver/stats/${id}`,
    GET_ONE_DRIVER: (id: string) => `/api/driver/${id}/detail`,

    // extra (since backend has these)
    UPDATE_AVAILABILITY: (id: string) => `/api/driver/${id}/status`,
    UPDATE_ORDER_STATUS: (id: string) => `/api/driver/orders/${id}/status`,
  },
  CART: {
    GET_MY_CART: "/api/cart/",
    ADD_ITEM: "/api/cart/items",
    UPDATE_ITEM_QTY: (productId: string) => `/api/cart/items/${productId}`,
    REMOVE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
    CLEAR: "/api/cart/",
  },
  ORDER: {
    CREATE: "/api/orders",
    GET_MY: "/api/orders/me",
    GET_ONE: (id: string) => `/api/orders/${id}`,

    // admin
    GET_ALL: "/api/orders/",
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    ASSIGN_DRIVER: (id: string) => `/api/orders/${id}/assign-driver`,

    GET_MY_ASSIGNED: "/api/orders/driver/my-orders",
    DRIVER_UPDATE_STATUS: (id: string) => `/api/orders/driver/${id}/status`,

    GET_DRIVERS: "/api/admin/users",
  },
  NOTIFICATION: {
    GET_MY: "/api/notifications/me",
    UNREAD_COUNT: "/api/notifications/me/unread-count",
    READ_ALL: "/api/notifications/me/read-all",
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,

    // admin only (optional)
    CREATE: "/api/notifications",
  },
};
