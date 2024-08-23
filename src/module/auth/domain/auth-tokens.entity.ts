import { AppRole } from './app-role.enum';

export class AuthToken {
  accessToken: string;
  refreshToken: string;
}

export class AuthTokenPayload {
  userId: number;
  role: AppRole;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}
