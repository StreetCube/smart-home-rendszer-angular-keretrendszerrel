import { UserAfterCreate } from '../../features/auth/types/User';
import { ProductForRoom } from '../../features/products/types/Product';
import { Room, RoomWithProductNumbers } from '../../features/rooms/types/Room';

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
  create:
    | GeneralCustomCode.CREATED
    | GeneralCustomCode.OTHER
    | GeneralCustomCode.BAD_REQUEST
    | ApiCustomCode.ALREADY_EXISTS;
  include:
    | GeneralCustomCode.CREATED
    | GeneralCustomCode.BAD_REQUEST
    | ApiCustomCode.ERROR_CREATING_RESOURCE
    | ApiCustomCode.ALREADY_EXISTS;
  room_with_product_numbers: GeneralCustomCode.SUCCESS | ApiCustomCode.ERROR_GETTING_RESOURCE;
  products_for_room: GeneralCustomCode.SUCCESS | GeneralCustomCode.BAD_REQUEST | ApiCustomCode.ERROR_GETTING_RESOURCE;
  update:
    | GeneralCustomCode.SUCCESS
    | ApiCustomCode.ERROR_GETTING_RESOURCE
    | ApiCustomCode.ERROR_CREATING_RESOURCE
    | ApiCustomCode.ALREADY_EXISTS;
  delete: GeneralCustomCode.SUCCESS | ApiCustomCode.ERROR_GETTING_RESOURCE | ApiCustomCode.ERROR_DELETEING_RESOURCE;
};

type DataForResponses = {
  login: UserAfterCreate;
  register: UserAfterCreate;
  get_all: any;
  status: UserAfterCreate & { iat: number; exp: number; isAuthenticated: true };
  all: any;
  logout: any;
  create: any;
  include: any;
  room_with_product_numbers: RoomWithProductNumbers[];
  products_for_room: ProductForRoom[] | null;
  update: Room;
  delete: any;
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
  ALREADY_EXISTS = 2001,
  ERROR_GETTING_RESOURCE = 2002, // Error getting resource from the API
  ERROR_CREATING_RESOURCE = 2003, // Error creating resource in the API
  ERROR_DELETEING_RESOURCE = 2004, // Error deleting resource in the API
}

export enum GeneralCustomCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 3333,
  OTHER = 9999,
}

export type CombinedCustomCode = AuthCustomCode | ApiCustomCode | GeneralCustomCode;
