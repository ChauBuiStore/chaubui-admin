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
  COLOR: {
    GET_ALL: '/colors',
    GET_BY_ID: '/colors/:id',
    CREATE: '/colors',
    UPDATE: '/colors/:id',
    DELETE: '/colors/:id',
    BULK_DELETE: '/colors/bulk-delete',
  },
  MENU: {
    GET_ALL: '/menu',
    GET_BY_ID: '/menu/:id',
    CREATE: '/menu',
    UPDATE: '/menu/:id',
    DELETE: '/menu/:id',
    BULK_DELETE: '/menu/bulk-delete',
    TOGGLE_PUBLIC: '/menu/:id/public',
  },
  UPLOAD: {
    UPLOAD: '/upload',
    DELETE: '/upload/:id',
  },
};