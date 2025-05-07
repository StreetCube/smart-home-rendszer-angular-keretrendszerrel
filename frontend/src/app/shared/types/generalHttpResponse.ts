import { UserAfterCreate } from '../../features/auth/types/User';

type EndpointCodes = {
  all: CombinedCustomCode;
  login: AuthCustomCode.INVALID_CREDENTIALS | AuthCustomCode.USER_NOT_FOUND | GeneralCustomCode.SUCCESS;
  register:
    | GeneralCustomCode.CREATED
    | GeneralCustomCode.OTHER
    | GeneralCustomCode.BAD_REQUEST
    | AuthCustomCode.USER_ALREADY_EXISTS
    | AuthCustomCode.PERMISSION_ADMIN;
  get_all: GeneralCustomCode.SUCCESS | ApiCustomCode.ERROR_GETTING_RESOURCE;
  status: GeneralCustomCode.SUCCESS | AuthCustomCode.INVALID_TOKEN | AuthCustomCode.NO_TOKEN_FOUND;
  logout: GeneralCustomCode.SUCCESS | AuthCustomCode.NO_TOKEN_FOUND;
};

type DataForResponses = {
  login: UserAfterCreate;
  register: UserAfterCreate;
  get_all: any;
  status: UserAfterCreate & { iat: number; exp: number; isAuthenticated: true };
  all: any;
  logout: any;
};

type ErrorCodeFor<E extends keyof EndpointCodes> = EndpointCodes[E];
type DataFor<E extends keyof EndpointCodes> = DataForResponses[E];

export interface GeneralHttpResponse<T extends keyof EndpointCodes, R = null> {
  error: {
    message: string;
    code: ErrorCodeFor<T>;
  };
  message?: string;
  code?: ErrorCodeFor<T>;
  data?: R extends null ? DataFor<T> : R;
}

export enum AuthCustomCode {
  INVALID_CREDENTIALS = 1001, // Invalid username or password
  USER_NOT_FOUND = 1002, // User not found in the database
  PASSWORD_EXPIRED = 1003, // Passwords do not match
  USER_ALREADY_EXISTS = 1004, // User already exists in the database
  INVALID_TOKEN = 1005, // Invalid or expired token
  PERMISSION_ADMIN = 1006, // Trying to create an admin user on registration
  NO_TOKEN_FOUND = 1007, // No token found in the request
}

export enum ApiCustomCode {
  ERROR_GETTING_RESOURCE = 2002, // Error getting resource from the API
}

export enum GeneralCustomCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 3333,
  OTHER = 9999,
}

export type CombinedCustomCode = AuthCustomCode | ApiCustomCode | GeneralCustomCode;
