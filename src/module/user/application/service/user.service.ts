import { Inject, Injectable } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '../interface/user-repository.interface';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../mapper/user.mapper';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async getAll({ page, limit }): Promise<UserResponseDto[]> {
    limit = Math.min(limit, 100);
    const userList = await this.userRepository.getAll(page, limit);
    return userList.map(this.userMapper.fromUsertoUserDto);
  }

  async getOneById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.getOneById(id);
    return this.userMapper.fromUsertoUserDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userToUpdate = this.userMapper.fromCreateUserDtoToUser(createUserDto);
    const newUser = await this.userRepository.create(userToUpdate);
    return this.userMapper.fromUsertoUserDto(newUser);
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userUpdate = this.userMapper.fromUpdateUserDtoToUser(updateUserDto);
    const userUpdated = await this.userRepository.update(userId, userUpdate);
    return this.userMapper.fromUsertoUserDto(userUpdated);
  }

  async delete(id: number): Promise<void> {
    return await this.userRepository.delete(id);
  }
}