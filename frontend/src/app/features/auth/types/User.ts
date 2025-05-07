export interface BaseUser {
  username: string;
  email: string;
  id: string;
}

export interface User extends BaseUser {
  password: string;
}

export interface UserToRegister extends Omit<BaseUser, 'id'> {
  password: string;
  confirmPassword: string;
}

export interface UserAfterCreate extends BaseUser {
  permission: string;
  createdAt: string;
  updatedAt: string;
}
