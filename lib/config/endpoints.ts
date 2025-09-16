export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  CATEGORY_GROUP: {
    GET_ALL: '/category-group',
    GET_BY_ID: '/category-group/:id',
    CREATE: '/category-group',
    UPDATE: '/category-group/:id',
    DELETE: '/category-group/:id',
    BULK_DELETE: '/category-group/bulk-delete',
  },
  CATEGORY: {
    GET_ALL: '/categories',
    GET_BY_ID: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
    BULK_DELETE: '/categories/bulk-delete',
  },
};