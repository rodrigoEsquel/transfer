import { Auth } from '../../domain/auth.entity';

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';

export interface IAuthRepository {
  getOneByUsername(username: string): Promise<Auth>;
  create(user: Auth): Promise<Auth>;
  update(id: number, user: Partial<Auth>): Promise<Auth>;
  delete(id: number): Promise<void>;
}
