import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { existsSync } from 'fs';

import { initTestApp, loadFixtures } from '../../../../../config/test.config';
import { dataSourceOptions } from '../../../../../config/orm.config';
import { configApp } from '../../../../../config/app.config';

import { LoginDto } from '../../../application/dto/login.dto';
import { UpdateAuthDto } from '../../../application/dto/update-auth.dto';
import { AppRole } from '../../../domain/app-role.enum';
import { RefreshTokenDto } from '../../../application/dto/refresh-token.dto';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const fixturePath = `${__dirname}/fixture`;
    if (existsSync(fixturePath)) {
      await loadFixtures(fixturePath, dataSourceOptions);
    }
    const testApp = await initTestApp();
    app = testApp.createNestApplication();
    configApp(app);
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return auth tokens for valid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'validuser@example.com',
        password: 'validpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toHaveProperty('accessToken');
          expect(body).toHaveProperty('refreshToken');
        });
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'invaliduser@example.com',
        password: 'invalidpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body).toMatchObject({
            message: 'Invalid username or password.',
            error: 'Unauthorized',
            statusCode: 401,
          });
        });
    });

    it('should return 400 for missing username', async () => {
      const loginDto = {
        password: 'somepassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing password', async () => {
      const loginDto = {
        username: 'someuser@example.com',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth (PUT)', () => {
    it('should update auth details and return new tokens', async () => {
      const updateAuthDto: UpdateAuthDto = {
        username: 'existinguser@example.com',
        password: 'currentpassword',
        newPassword: 'newpassword123',
        role: AppRole.USER,
      };

      await request(app.getHttpServer())
        .put('/auth')
        .send(updateAuthDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toHaveProperty('accessToken');
          expect(body).toHaveProperty('refreshToken');
        });
    });

    it('should return 401 for incorrect current password', async () => {
      const updateAuthDto: UpdateAuthDto = {
        username: 'existinguser@example.com',
        password: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      await request(app.getHttpServer())
        .put('/auth')
        .send(updateAuthDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for missing required fields', async () => {
      const updateAuthDto = {
        username: 'existinguser@example.com',
      };

      await request(app.getHttpServer())
        .put('/auth')
        .send(updateAuthDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should return new auth tokens for a valid refresh token', async () => {
      let validRefreshToken: string;
      const loginDto: LoginDto = {
        username: 'validuser@example.com',
        password: 'validpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .then(({ body }) => {
          validRefreshToken = body.refreshToken;
        });

      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: validRefreshToken,
      };

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(refreshTokenDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toHaveProperty('accessToken');
          expect(body).toHaveProperty('refreshToken');
        });
    });

    it('should return 401 for an invalid refresh token', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'invalid_refresh_token',
      };

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(refreshTokenDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for missing refresh token', async () => {
      const refreshTokenDto = {};

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(refreshTokenDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
