import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AppRole } from '../../domain/app-role.enum';

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
}
