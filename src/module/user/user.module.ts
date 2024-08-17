import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './application/service/user.service';
import { USER_REPOSITORY } from './application/interface/user-repository.interface';
import { UserMapper } from './application/mapper/user.mapper';
import { UserController } from './interface/controller/user.controller';
import { UserSchema } from './infrastructure/database/user.schema';
import { UserRepository } from './infrastructure/database/user.repository';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    UserMapper,
  ],
})
export class UserModule {}
