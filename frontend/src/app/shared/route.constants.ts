export class RouteConstants {
  public static readonly AUTH = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    STATUS: '/auth/status',
  };
  public static readonly CRUD = {
    CREATE: (modelName: string) => `/crud/${modelName}/create`,
    GET_ALL: (modelName: string) => `/crud/${modelName}/get-all`,
    UPDATE: (modelName: string) => `/crud/${modelName}/update`,
    DELETE: (modelName: string, id: string) => `/crud/${modelName}/${id}/delete`,
    ROOM_WITH_PRODUCT_NUMBERS: `/crud/Room/rooms-with-product-numbers`,
    GET_PRODUCTS_FOR_ROOM: (roomId: string) => `/crud/Product/${roomId}/products`,
  };
  public static readonly DEVICE = {
    INCLUDE: '/device/include',
    SEND_COMMAND: '/device/send-command',
  };
  static readonly DASHBOARD = '/dashboard';
  static readonly USER_PROFILE = '/user-profile';
  static readonly SETTINGS = '/settings';
  static readonly NOT_FOUND = '/not-found';
}
