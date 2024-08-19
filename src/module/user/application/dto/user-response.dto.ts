import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({})
  firstName: string;

  @ApiProperty({})
  lastName: string;

  @ApiProperty({})
  email: string;
}
