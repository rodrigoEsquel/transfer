import { Inject, Injectable } from '@nestjs/common';

import { AuthToken, AuthTokenPayload } from '../../domain/auth-tokens.entity';
import { Auth } from '../../domain/auth.entity';
import {
  TOKEN_PROVIDER,
  ITokenProvider,
} from '../interface/token-provider.interface';
import {
  AUTH_REPOSITORY,
  IAuthRepository,
} from '../interface/auth-repository.interface';
import { AuthMapper } from '../mapper/auth.mapper';
import { InvalidCredentialsException } from '../exception/invalid-auth-credential.exception';

import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';

import { CryptoService } from '../../../common/application/service/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: ITokenProvider,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    private readonly cryptoService: CryptoService,
    private readonly authMapper: AuthMapper,
  ) {}

  private async verifyCredentials(
    password: string,
    username: string,
  ): Promise<Auth> {
    const userAuth = await this.authRepository.getOneByUsername(username);

    const isValidAuth = await this.cryptoService.verifyHash(
      password,
      userAuth.secret,
    );

    if (!isValidAuth) {
      throw new InvalidCredentialsException();
    }
    return userAuth;
  }

  async login(username: string, password: string): Promise<AuthToken> {
    const userAuth = await this.verifyCredentials(password, username);

    return await this.tokenProvider.generateTokens({
      userId: userAuth.id,
      role: userAuth.role,
    });
  }

  async create(createAuthDto: CreateAuthDto): Promise<Auth> {
    const secret = await this.cryptoService.hashSecret(createAuthDto.password);
    const newAuth = this.authMapper.fromCreateAuthDtoToAuth(createAuthDto);

    return await this.authRepository.create({ ...newAuth, secret });
  }

  async update(updateAuthDto: UpdateAuthDto): Promise<AuthToken> {
    const { username, password, newPassword } = updateAuthDto;

    const userAuth = await this.verifyCredentials(password, username);

    const newAuth = this.authMapper.fromUpdateAuthDtoToAuth(updateAuthDto);
    const newSecret = await this.cryptoService.hashSecret(newPassword);

    await this.authRepository.update(userAuth.id, {
      ...newAuth,
      secret: newSecret,
    });

    return await this.tokenProvider.generateTokens({
      userId: userAuth.user.id,
      role: userAuth.role,
    });
  }

  async verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    return await this.tokenProvider.verifyAccessToken(token);
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthToken> {
    return await this.tokenProvider.refreshAccessToken(refreshToken);
  }
}
