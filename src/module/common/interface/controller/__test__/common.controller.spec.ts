import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { existsSync } from 'fs';

import { initTestApp, loadFixtures } from '../../../../../config/test.config';
import { dataSourceOptions } from '../../../../../config/orm.config';
import { configApp } from '../../../../../config/app.config';

describe('Common Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const fixturePath = `${__dirname}/fixture`;
    if (existsSync(fixturePath)) {
      await loadFixtures(fixturePath, dataSourceOptions);
    }
    const testApp = await initTestApp();
    app = testApp.createNestApplication({ logger: false });
    configApp(app);
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return an OK state', async () => {
      await request(app.getHttpServer())
        .get('/common/health')
        .expect(HttpStatus.OK);
    });
  });
});
