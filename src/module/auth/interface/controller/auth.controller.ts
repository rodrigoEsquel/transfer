import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../../application/service/auth.service';
import { AuthToken } from '../../domain/auth-tokens.entity';
import { LoginDto } from '../../application/dto/login.dto';
import { badCredentialsSchema } from './schema/bad-credentials.schema';
import { UpdateAuthDto } from '../../application/dto/update-auth.dto';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';

@ApiTags('Auth')
@ApiBadRequestResponse({
  schema: { example: badCredentialsSchema },
  description: 'Bad Credentials',
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: AuthToken,
    description: 'Auth Tokens',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto): Promise<AuthToken> {
    return await this.authService.login(loginDto.username, loginDto.password);
  }

  @ApiOkResponse({
    type: AuthToken,
    description: 'Auth Tokens Updated',
  })
  @Put()
  async update(@Body() updateAuthDto: UpdateAuthDto): Promise<AuthToken> {
    return await this.authService.update(updateAuthDto);
  }

  @ApiOkResponse({
    type: AuthToken,
    description: 'Auth Tokens Updated',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthToken> {
    return await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
  }
}
