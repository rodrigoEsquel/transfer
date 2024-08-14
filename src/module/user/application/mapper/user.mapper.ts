import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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
}
