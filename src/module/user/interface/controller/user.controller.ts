import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  PageQueryParamsDto,
  LimitQueryParamsDto,
} from '../../../../common/dto/pagination.dto';

import { UserService } from '../../application/service/user.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { UserResponseDto } from '../../application/dto/user-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('limit') limit: LimitQueryParamsDto,
  ): Promise<UserResponseDto[]> {
    return await this.userService.getAll(page.page, limit.limit);
  }

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<UserResponseDto> {
    return await this.userService.getOneById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.userService.delete(id);
  }
}
