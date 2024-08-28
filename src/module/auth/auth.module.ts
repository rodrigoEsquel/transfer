import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './application/service/auth.service';
import { TOKEN_PROVIDER } from './application/interface/token-provider.interface';
import { AUTH_REPOSITORY } from './application/interface/auth-repository.interface';
import { TokenProviderService } from './infrastructure/auth-provider/token-provider.service';
import { AuthRepository } from './infrastructure/database/auth.repository';
import { AuthSchema } from './infrastructure/database/auth.schema';
import { AuthMapper } from './application/mapper/auth.mapper';
import { AuthController } from './interface/controller/auth.controller';

import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, ConfigModule, TypeOrmModule.forFeature([AuthSchema])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    {
      provide: TOKEN_PROVIDER,
      useClass: TokenProviderService,
    },
    AuthMapper,
  ],
  exports: [AuthService],
})
export class AuthModule {}
