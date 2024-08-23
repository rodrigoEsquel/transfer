import { AuthToken, AuthTokenPayload } from '../../domain/auth-tokens.entity';

export const TOKEN_PROVIDER = 'TOKEN_PROVIDER';

export interface ITokenProvider {
  generateTokens(payload: AuthTokenPayload): Promise<AuthToken>;
  verifyAccessToken(token: string): Promise<AuthTokenPayload>;
  refreshAccessToken(token: string): Promise<AuthToken>;
}
