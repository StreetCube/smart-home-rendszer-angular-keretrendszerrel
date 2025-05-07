exports.BASE_ROUTE = Object.freeze({
  AUTH: '/auth',
  API: '/api',
  CRUD: '/crud/:modelName',
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
  },
});
