import { Injectable } from '@nestjs/common';

import { Auth } from '../../domain/auth.entity';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';

@Injectable()
export class AuthMapper {
  fromCreateAuthDtoToAuth(createAuthDto: CreateAuthDto): Auth {
    const newAuth = new Auth();
    newAuth.username = createAuthDto.username;
    newAuth.role = createAuthDto.role;
    newAuth.user = createAuthDto.user;
    return newAuth;
  }

  fromUpdateAuthDtoToAuth(updateAuthDto: UpdateAuthDto): Auth {
    const newAuth = new Auth();
    newAuth.username = updateAuthDto.username;
    newAuth.role = updateAuthDto.role;
    return newAuth;
  }
}
