import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IAuthRepository } from '../../application/interface/auth-repository.interface';
import { AuthSchema } from './auth.schema';
import { Auth } from '../../domain/auth.entity';
import { InvalidCredentialsException } from '../../application/exeption/invalid-auth-credential.exeption';

@Injectable()
export class AuthRepository implements IAuthRepository {
  private readonly repository: Repository<Auth>;

  constructor(private readonly datasource: DataSource) {
    this.repository = this.datasource.getRepository(AuthSchema);
  }

  async getOneByUsername(username: string): Promise<Auth> {
    const auth = await this.repository.findOneBy({ username });
    if (!auth) {
      throw new InvalidCredentialsException();
    }
    return auth;
  }

  async create(auth: Auth): Promise<Auth> {
    return this.repository.save(auth);
  }

  async update(id: number, auth: Partial<Auth>): Promise<Auth> {
    const existingAuth = await this.repository.findOneBy({ id });

    if (!existingAuth) {
      throw new InvalidCredentialsException();
    }
    return await this.repository.save({ ...existingAuth, ...auth });
  }

  async delete(id: number): Promise<void> {
    const auth = await this.repository.findOneBy({ id });
    if (!auth) {
      throw new InvalidCredentialsException();
    }
    await this.repository.softDelete(id);
  }
}
