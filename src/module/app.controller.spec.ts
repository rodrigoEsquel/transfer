import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { initTestApp, loadFixtures } from '../config/test.config';
import { dataSourceOptions } from '../config/orm.config';
import { existsSync } from 'fs';

describe('AppController', () => {
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

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      await request(app.getHttpServer())
        .get('/')
        .expect(HttpStatus.OK)
        .then(({ text }) => {
          expect(text).toEqual('Hello World!');
        });
    });
  });
});
