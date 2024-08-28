import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { exceptionResponseMapper } from '../../../../common/interface/controller/exception-response.mapper';

import { AuthService } from '../../application/service/auth.service';
import { AuthToken } from '../../domain/auth-tokens.entity';
import { LoginDto } from '../../application/dto/login.dto';
import { UpdateAuthDto } from '../../application/dto/update-auth.dto';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';
import { InvalidCredentialsException } from '../../application/exception/invalid-auth-credential.exception';
import { InvalidTokenException } from '../../application/exception/invalid-token.exception';

@ApiTags('Auth')
@ApiBadRequestResponse({
  schema: { example: exceptionResponseMapper(InvalidCredentialsException) },
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
  @ApiUnauthorizedResponse({
    schema: { example: exceptionResponseMapper(InvalidTokenException) },
    description: 'Invalid Token Provided',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthToken> {
    return await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
  }
}
