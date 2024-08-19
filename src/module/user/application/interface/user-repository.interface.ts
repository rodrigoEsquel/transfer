import { User } from '../../domain/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  getAll(page?: number, limit?: number): Promise<User[]>;
  getOneById(id: number): Promise<User>;
  create(user: User): Promise<User>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
