import { USER_STATUS, UserModel } from '../model/user.model';

export const sampleUsers: Array<Omit<UserModel, '_id'>> = [
  {
    first_name: 'John',
    last_name: 'Doe',
    age: 25,
    email: 'john.doe@example.com',
    status: USER_STATUS.ACTIVE,
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    age: 30,
    email: 'jane.doe@example.com',
    status: USER_STATUS.INACTIVE,
  },
  {
    first_name: 'Bob',
    last_name: 'Smith',
    age: 40,
    email: 'bob.smith@example.com',
    status: USER_STATUS.PENDING,
  },
  {
    first_name: 'Alice',
    last_name: 'Johnson',
    age: 35,
    email: 'alice.johnson@example.com',
    status: USER_STATUS.ACTIVE,
  },
  {
    first_name: 'Charlie',
    last_name: 'Brown',
    age: 45,
    email: 'charlie.brown@example.com',
    status: USER_STATUS.INACTIVE,
  },
];
