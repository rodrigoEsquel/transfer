import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageQueryParamsDto {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  number?: number;
}

export class SizeQueryParamsDto {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  size?: number;
}
