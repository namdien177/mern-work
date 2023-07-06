export type UserModel = {
  _id: string;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  status: USER_STATUS;
};

export enum USER_STATUS {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  PENDING = 'pending',
}
