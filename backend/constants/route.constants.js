exports.BASE_ROUTE = Object.freeze({
  AUTH: '/auth',
  API: '/api',
  CRUD: '/crud/:modelName',
  DEVICE: '/device',
});

exports.ROUTES = Object.freeze({
  AUTH: {
    LOGIN: `/login`,
    LOGOUT: `/logout`,
    STATUS: `/status`,
    FORGOT_PASSWORD: `/forgot-password`,
    RESET_PASSWORD: `/reset-password`,
  },
  CRUD: {
    CREATE: `/create`,
    GET_ALL: '/get-all',
    ROOMS_WITH_PRODUCT_NUMBERS: '/rooms-with-product-numbers',
    GET_PRODUCTS_FOR_ROOM: '/:roomId/products',
  },
  DEVICE: {
    INCLUDE: '/include',
    EXCLUDE: '/:ieeeAddress/exclude',
  },
});
