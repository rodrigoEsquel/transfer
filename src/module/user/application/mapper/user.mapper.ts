import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../../domain/user.entity';

@Injectable()
export class UserMapper {
  fromCreateUserDtoToUser(createUserDto: CreateUserDto): User {
    const userResponse = new User();
    userResponse.firstName = createUserDto.firstName;
    userResponse.lastName = createUserDto.lastName;
    userResponse.email = createUserDto.email;
    return userResponse;
  }

  fromUpdateUserDtoToUser(updateUserDto: UpdateUserDto): User {
    const userResponse = new User();
    userResponse.firstName = updateUserDto.firstName;
    userResponse.lastName = updateUserDto.lastName;
    userResponse.email = updateUserDto.email;
    return userResponse;
  }

  fromUserToUserDto(user: User): UserResponseDto {
    const userDtoResponse = new UserResponseDto();
    userDtoResponse.firstName = user.firstName;
    userDtoResponse.lastName = user.lastName;
    userDtoResponse.email = user.email;
    return userDtoResponse;
  }
}
