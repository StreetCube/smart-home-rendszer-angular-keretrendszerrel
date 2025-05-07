export class RouteConstants {
  public static readonly AUTH = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    STATUS: '/auth/status',
  };
  public static readonly CRUD = {
    CREATE: (modelName: string) => `/crud/${modelName}/create`,
    GET_ALL: (modelName: string) => `/crud/${modelName}/get-all`,
  };
  static readonly DASHBOARD = '/dashboard';
  static readonly USER_PROFILE = '/user-profile';
  static readonly SETTINGS = '/settings';
  static readonly NOT_FOUND = '/not-found';
}
