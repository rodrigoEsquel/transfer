import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  email?: string;
}
