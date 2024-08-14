import { Inject, Injectable } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '../interface/user-repository.interface';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../mapper/user.mapper';
import { User } from '../../domain/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async getAll({ page, limit }): Promise<User[]> {
    limit = Math.min(limit, 100);
    return await this.userRepository.getAll(page, limit);
  }

  async getOneById(id: number): Promise<User> {
    return await this.userRepository.getOneById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userMapper.fromCreateUserDtoToUser(createUserDto);
    return await this.userRepository.create(newUser);
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const userUpdate = this.userMapper.fromUpdateUserDtoToUser(updateUserDto);
    return await this.userRepository.update(userUpdate);
  }

  async delete(id: number): Promise<void> {
    return await this.userRepository.delete(id);
  }
}
