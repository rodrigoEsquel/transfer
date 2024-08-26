import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { ITokenProvider } from '../../application/interface/token-provider.interface';
import { AuthToken, AuthTokenPayload } from '../../domain/auth-tokens.entity';
import { InvalidTokenException } from '../../application/exception/invalid-token.exeption';

@Injectable()
export class TokenProviderService implements ITokenProvider {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenDuration: string;
  private readonly refreshTokenDuration: string;

  constructor(private readonly configService: ConfigService) {
    this.accessTokenSecret = this.configService.get('token.accessSecret');
    this.refreshTokenSecret = this.configService.get('token.refreshSecret');
    this.accessTokenDuration = this.configService.get(
      'token.accessTokenDuration',
    );
    this.refreshTokenDuration = this.configService.get(
      'token.refreshTokenDuration',
    );
  }

  async generateTokens(payload: AuthTokenPayload): Promise<AuthToken> {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenDuration,
    });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenDuration,
    });
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    try {
      const payload = jwt.verify(
        token,
        this.accessTokenSecret,
      ) as AuthTokenPayload;
      return payload;
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async verifyRefreshToken(token: string): Promise<AuthTokenPayload> {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as AuthTokenPayload;
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthToken> {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      delete payload.exp;
      return this.generateTokens(payload);
    } catch (error) {
      throw new InvalidTokenException();
    }
  }
}
