import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IUserRepository } from '../../application/interface/user-repository.interface';
import { User } from '../../domain/user.entity';
import { UserSchema } from './user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repository: Repository<User>;

  constructor(private readonly datasource: DataSource) {
    this.repository = this.datasource.getRepository(UserSchema);
  }

  async getAll(page: number = 1, pageSize: number = 10): Promise<User[]> {
    const skip = (page - 1) * pageSize;
    return this.repository.find({
      skip,
      take: pageSize,
    });
  }

  async getOneById(id: number): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
