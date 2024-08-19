import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  PageQueryParamsDto,
  LimitQueryParamsDto,
} from '../../../../common/dto/pagination.dto';
import { badIdProvidedSchema } from '../../../../common/interface/controller/schema/bad-id-provided.schema';

import { userNotFoundSchema } from './schema/user-not-found.schema';
import { UserService } from '../../application/service/user.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { UserResponseDto } from '../../application/dto/user-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @Get()
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('limit') limit: LimitQueryParamsDto,
  ): Promise<UserResponseDto[]> {
    return await this.userService.getAll(page.page, limit.limit);
  }

  @ApiOkResponse({
    type: UserResponseDto,
    description: 'List of Users',
  })
  @ApiNotFoundResponse({
    schema: { example: userNotFoundSchema },
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    schema: { example: badIdProvidedSchema },
    description: 'Bad request',
  })
  @Get('/:id')
  async getById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserResponseDto> {
    return await this.userService.getOneById(id);
  }

  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User updated',
  })
  @ApiNotFoundResponse({
    schema: { example: userNotFoundSchema },
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    schema: { example: badIdProvidedSchema },
    description: 'Bad request',
  })
  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse({
    schema: { example: userNotFoundSchema },
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    schema: { example: badIdProvidedSchema },
    description: 'Bad request',
  })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return await this.userService.delete(id);
  }
}
