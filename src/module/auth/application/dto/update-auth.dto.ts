import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  newPassword?: string;

  @ApiPropertyOptional()
  @IsString()
  role?: AppRole;

  @ApiPropertyOptional()
  @IsString()
  user?: User;
}
