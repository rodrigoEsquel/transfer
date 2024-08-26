import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AppRole } from '../../domain/app-role.enum';

import { User } from '../../../user/domain/user.entity';

export class UpdateAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  newPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: AppRole;

  @ApiPropertyOptional()
  @IsString()
  user?: User;
}
