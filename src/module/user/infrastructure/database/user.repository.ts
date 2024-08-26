import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserSchema } from './user.schema';
import { IUserRepository } from '../../application/interface/user-repository.interface';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../application/exception/user-not-found.exception';

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
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const existingUser = await this.repository.findOneBy({ id });

    if (!existingUser) {
      throw new UserNotFoundException();
    }
    return await this.repository.save({ ...existingUser, ...user });
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException();
    }
    await this.repository.softDelete(id);
  }
}
