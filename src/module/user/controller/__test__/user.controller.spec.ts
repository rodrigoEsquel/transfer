import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { existsSync } from 'fs';

import { initTestApp, loadFixtures } from '../../../../config/test.config';
import { dataSourceOptions } from '../../../../config/orm.config';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

describe('User Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const fixturePath = `${__dirname}/fixture`;
    if (existsSync(fixturePath)) {
      await loadFixtures(fixturePath, dataSourceOptions);
    }
    const testApp = await initTestApp();
    app = testApp.createNestApplication({ logger: false });
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user (GET)', () => {
    it('should return an array of users', async () => {
      const pageLimit = 10;
      await request(app.getHttpServer())
        .get('/user')
        .query({ page: 1, limit: pageLimit })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBeTruthy();
          expect(body.length).toEqual(pageLimit);
        });
    });
  });

  describe('/user/:id (GET)', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toHaveProperty('firstName');
        });
    });

    it('should return 404 if user not found', async () => {
      const nonExistentUserId = 9999;
      await request(app.getHttpServer())
        .get(`/user/${nonExistentUserId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/user (POST)', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'New User First',
        lastName: 'New User Last',
        email: 'newuser@example.com',
      };

      await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toHaveProperty('firstName', createUserDto.firstName);
          expect(body).toHaveProperty('lastName', createUserDto.lastName);
          expect(body).toHaveProperty('email', createUserDto.email);
        });
    });
  });

  describe('/user (PUT)', () => {
    it('should update an existing user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated User',
      };

      await request(app.getHttpServer())
        .put(`/user/${userId}`)
        .send(updateUserDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toHaveProperty('firstName', updateUserDto.firstName);
        });
    });

    it('should return 404 if user not found', async () => {
      const nonExistentUserId = 9999;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated User',
      };
      await request(app.getHttpServer())
        .put(`/user/${nonExistentUserId}`)
        .send(updateUserDto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
