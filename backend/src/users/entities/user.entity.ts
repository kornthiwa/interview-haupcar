export class User {
  id: string;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, 'password'>;
