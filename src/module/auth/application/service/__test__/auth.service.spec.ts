import { TestBed } from '@automock/jest';
import { AuthService } from '../auth.service';
import {
  ITokenProvider,
  TOKEN_PROVIDER,
} from '../../interface/token-provider.interface';
import {
  AUTH_REPOSITORY,
  IAuthRepository,
} from '../../interface/auth-repository.interface';
import { AuthMapper } from '../../mapper/auth.mapper';
import { Auth } from '../../../domain/auth.entity';
import { AppRole } from '../../../domain/app-role.enum';
import {
  AuthToken,
  AuthTokenPayload,
} from '../../../domain/auth-tokens.entity';
import { CreateAuthDto } from '../../dto/create-auth.dto';
import { InvalidCredentialsException } from '../../exception/invalid-auth-credential.exception';

import { CryptoService } from '../../../../common/application/service/crypto.service';

import { User } from '../../../../user/domain/user.entity';
import { UpdateAuthDto } from '../../dto/update-auth.dto';

describe('AuthService Unit Test', () => {
  let authService: AuthService;
  let tokenProvider: jest.Mocked<ITokenProvider>;
  let authRepository: jest.Mocked<IAuthRepository>;
  let cryptoService: jest.Mocked<CryptoService>;
  let authMapper: jest.Mocked<AuthMapper>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthService)
      .mock(TOKEN_PROVIDER)
      .using(tokenProvider)
      .mock(AUTH_REPOSITORY)
      .using(authRepository)
      .mock(CryptoService)
      .using(cryptoService)
      .mock(AuthMapper)
      .using(authMapper)
      .compile();

    authService = unit;
    tokenProvider = unitRef.get(TOKEN_PROVIDER);
    authRepository = unitRef.get(AUTH_REPOSITORY);
    cryptoService = unitRef.get(CryptoService);
    authMapper = unitRef.get(AuthMapper);
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  describe('verifyCredentials', () => {
    it('should verify credentials successfully', async () => {
      const username = 'testuser';
      const password = 'password123';
      const mockAuth: Auth = {
        id: 1,
        username,
        secret: 'hashedPassword',
        role: AppRole.USER,
        user: {} as User,
      };

      authRepository.getOneByUsername.mockResolvedValueOnce(mockAuth);
      cryptoService.verifyHash.mockResolvedValueOnce(true);

      const result = await authService['verifyCredentials'](password, username);

      expect(authRepository.getOneByUsername).toHaveBeenCalledWith(username);
      expect(cryptoService.verifyHash).toHaveBeenCalledWith(
        password,
        mockAuth.secret,
      );
      expect(result).toEqual(mockAuth);
    });

    it('should throw InvalidCredentialsException for invalid password', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const mockAuth: Auth = {
        id: 1,
        username,
        secret: 'hashedPassword',
        role: AppRole.USER,
        user: {} as User,
      };

      authRepository.getOneByUsername.mockResolvedValueOnce(mockAuth);
      cryptoService.verifyHash.mockResolvedValueOnce(false);

      await expect(
        authService['verifyCredentials'](password, username),
      ).rejects.toThrow(InvalidCredentialsException);
    });
  });

  describe('login', () => {
    it('should login successfully and return AuthToken', async () => {
      const username = 'testuser';
      const password = 'password123';
      const mockAuth: Auth = {
        id: 1,
        username,
        secret: 'hashedPassword',
        role: AppRole.USER,
        user: {} as User,
      };
      const mockAuthToken: AuthToken = {
        accessToken: 'accessToken123',
        refreshToken: 'refreshToken123',
      };

      jest
        .spyOn(authService as any, 'verifyCredentials')
        .mockResolvedValueOnce(mockAuth);
      tokenProvider.generateTokens.mockResolvedValueOnce(mockAuthToken);

      const result = await authService.login(username, password);

      expect(authService['verifyCredentials']).toHaveBeenCalledWith(
        password,
        username,
      );
      expect(tokenProvider.generateTokens).toHaveBeenCalledWith({
        userId: mockAuth.id,
        role: mockAuth.role,
      });
      expect(result).toEqual(mockAuthToken);
    });
  });

  describe('create', () => {
    it('should create a new auth successfully', async () => {
      const createAuthDto: CreateAuthDto = {
        username: 'newuser',
        password: 'newpassword',
        role: AppRole.USER,
        user: {} as User,
      };
      const hashedSecret = 'hashedNewPassword';
      const mockNewAuth: Auth = {
        id: 2,
        username: createAuthDto.username,
        secret: hashedSecret,
        role: createAuthDto.role,
        user: createAuthDto.user,
      };

      cryptoService.hashSecret.mockResolvedValueOnce(hashedSecret);
      authMapper.fromCreateAuthDtoToAuth.mockReturnValueOnce(mockNewAuth);
      authRepository.create.mockResolvedValueOnce(mockNewAuth);

      const result = await authService.create(createAuthDto);

      expect(cryptoService.hashSecret).toHaveBeenCalledWith(
        createAuthDto.password,
      );
      expect(authMapper.fromCreateAuthDtoToAuth).toHaveBeenCalledWith(
        createAuthDto,
      );
      expect(authRepository.create).toHaveBeenCalledWith({
        ...mockNewAuth,
        secret: hashedSecret,
      });
      expect(result).toEqual(mockNewAuth);
    });
  });

  describe('update', () => {
    it('should update auth successfully and return new AuthToken', async () => {
      const updateAuthDto: UpdateAuthDto = {
        username: 'existinguser',
        password: 'oldpassword',
        newPassword: 'newpassword',
        role: AppRole.ADMIN,
      };
      const mockExistingAuth: Auth = {
        id: 3,
        username: updateAuthDto.username,
        secret: 'oldHashedPassword',
        role: AppRole.USER,
        user: { id: 3 } as User,
      };
      const newHashedSecret = 'newHashedPassword';
      const mockUpdatedAuth: Auth = {
        ...mockExistingAuth,
        secret: newHashedSecret,
        role: updateAuthDto.role,
      };
      const mockAuthToken: AuthToken = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      jest
        .spyOn(authService as any, 'verifyCredentials')
        .mockResolvedValueOnce(mockExistingAuth);
      authMapper.fromUpdateAuthDtoToAuth.mockReturnValueOnce(mockUpdatedAuth);
      cryptoService.hashSecret.mockResolvedValueOnce(newHashedSecret);
      authRepository.update.mockResolvedValueOnce(mockUpdatedAuth);
      tokenProvider.generateTokens.mockResolvedValueOnce(mockAuthToken);

      const result = await authService.update(updateAuthDto);

      expect(authService['verifyCredentials']).toHaveBeenCalledWith(
        updateAuthDto.password,
        updateAuthDto.username,
      );
      expect(authMapper.fromUpdateAuthDtoToAuth).toHaveBeenCalledWith(
        updateAuthDto,
      );
      expect(cryptoService.hashSecret).toHaveBeenCalledWith(
        updateAuthDto.newPassword,
      );
      expect(authRepository.update).toHaveBeenCalledWith(mockExistingAuth.id, {
        ...mockUpdatedAuth,
        secret: newHashedSecret,
      });
      expect(tokenProvider.generateTokens).toHaveBeenCalledWith({
        userId: mockExistingAuth.user.id,
        role: mockUpdatedAuth.role,
      });
      expect(result).toEqual(mockAuthToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token successfully', async () => {
      const token = 'validAccessToken';
      const mockPayload: AuthTokenPayload = {
        userId: 4,
        role: AppRole.USER,
      };

      tokenProvider.verifyAccessToken.mockResolvedValueOnce(mockPayload);
      const result = await authService.verifyAccessToken(token);

      expect(tokenProvider.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockPayload);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const refreshToken = 'validRefreshToken';
      const mockAuthToken: AuthToken = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      tokenProvider.refreshAccessToken.mockResolvedValueOnce(mockAuthToken);

      const result = await authService.refreshAccessToken(refreshToken);

      expect(tokenProvider.refreshAccessToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(result).toEqual(mockAuthToken);
    });
  });

  describe('Error cases', () => {
    it('should throw an error when username is not found during login', async () => {
      const username = 'nonexistentuser';
      const password = 'password123';

      authRepository.getOneByUsername.mockRejectedValueOnce(
        new Error('User not found'),
      );

      await expect(authService.login(username, password)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error when creating auth with existing username', async () => {
      const createAuthDto: CreateAuthDto = {
        username: 'existinguser',
        password: 'password',
        role: AppRole.USER,
        user: {} as User,
      };

      authRepository.create.mockRejectedValueOnce(
        new Error('Username already exists'),
      );

      await expect(authService.create(createAuthDto)).rejects.toThrow(
        'Username already exists',
      );
    });

    it('should throw an error when updating non-existent auth', async () => {
      const updateAuthDto: UpdateAuthDto = {
        username: 'nonexistentuser',
        password: 'oldpassword',
        newPassword: 'newpassword',
      };

      jest
        .spyOn(authService as any, 'verifyCredentials')
        .mockRejectedValueOnce(new Error('User not found'));

      await expect(authService.update(updateAuthDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error when verifying invalid access token', async () => {
      const invalidToken = 'invalidAccessToken';

      tokenProvider.verifyAccessToken.mockRejectedValueOnce(
        new Error('Invalid token'),
      );

      await expect(authService.verifyAccessToken(invalidToken)).rejects.toThrow(
        'Invalid token',
      );
    });

    it('should throw an error when refreshing with invalid refresh token', async () => {
      const invalidRefreshToken = 'invalidRefreshToken';

      tokenProvider.refreshAccessToken.mockRejectedValueOnce(
        new Error('Invalid refresh token'),
      );

      await expect(
        authService.refreshAccessToken(invalidRefreshToken),
      ).rejects.toThrow('Invalid refresh token');
    });
  });
});
