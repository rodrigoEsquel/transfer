import { TestBed } from '@automock/jest';

import { UserService } from '../user.service';
import { UserMapper } from '../../mapper/user.mapper';
import { USER_REPOSITORY } from '../../interface/user-repository.interface';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserResponseDto } from '../../dto/user-response.dto';
import { UserRepository } from '../../../infrastructure/database/user.repository';
import { User } from '../../../domain/user.entity';

import { AppRole } from '../../../../auth/domain/app-role.enum';

describe('UserService Unit Test', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let userMapper: jest.Mocked<UserMapper>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserService)
      .mock(USER_REPOSITORY)
      .using(UserRepository)
      .compile();

    userService = unit;
    userRepository = unitRef.get(USER_REPOSITORY);
    userMapper = unitRef.get(UserMapper);
  });

  it('should retrieve users from the repository', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@gmail.com',
      },
    ];
    const mockUserDtos: UserResponseDto[] = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com' },
      { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@gmail.com' },
    ];

    userRepository.getAll.mockResolvedValue(mockUsers);
    userMapper.fromUserToUserDto.mockImplementation((user) =>
      mockUserDtos.find((dto) => dto.firstName === user.firstName),
    );

    const users = await userService.getAll(1, 10);

    expect(userRepository.getAll).toHaveBeenCalledWith(1, 10);
    expect(users).toEqual(mockUserDtos);
  });

  it('should retrieve a user by id from the repository', async () => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    };
    const mockUserDto: UserResponseDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    };

    userRepository.getOneById.mockResolvedValue(mockUser);
    userMapper.fromUserToUserDto.mockReturnValue(mockUserDto);

    const user = await userService.getOneById(1);

    expect(userRepository.getOneById).toHaveBeenCalledWith(1);
    expect(user).toEqual(mockUserDto);
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'new.john.doe@gmail.com',
      password: 'my.new@passw0rd',
      role: AppRole.USER,
    };
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'new.john.doe@gmail.com',
    };
    const mockUserDto: UserResponseDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'new.john.doe@gmail.com',
    };

    userMapper.fromCreateUserDtoToUser.mockReturnValue(mockUser);
    userRepository.create.mockResolvedValue(mockUser);
    userMapper.fromUserToUserDto.mockReturnValue(mockUserDto);

    const createdUser = await userService.create(createUserDto);

    expect(userMapper.fromCreateUserDtoToUser).toHaveBeenCalledWith(
      createUserDto,
    );
    expect(userRepository.create).toHaveBeenCalledWith(mockUser);
    expect(createdUser).toEqual(mockUserDto);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'new.jane.doe@gmail.com',
    };
    const mockUser: User = {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'new.jane.doe@gmail.com',
    };
    const mockUserDto: UserResponseDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'new.jane.doe@gmail.com',
    };

    userMapper.fromUpdateUserDtoToUser.mockReturnValue(mockUser);
    userRepository.update.mockResolvedValue(mockUser);
    userMapper.fromUserToUserDto.mockReturnValue(mockUserDto);

    const updatedUser = await userService.update(1, updateUserDto);

    expect(userMapper.fromUpdateUserDtoToUser).toHaveBeenCalledWith(
      updateUserDto,
    );
    expect(userRepository.update).toHaveBeenCalledWith(1, mockUser);
    expect(updatedUser).toEqual(mockUserDto);
  });

  it('should delete a user', async () => {
    userRepository.delete.mockResolvedValue(undefined);

    await userService.delete(1);

    expect(userRepository.delete).toHaveBeenCalledWith(1);
  });
});
