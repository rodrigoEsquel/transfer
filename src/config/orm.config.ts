import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ENVIRONMENT } from './const/env.enum';

dotenv.config();

const production: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const development: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};

const test: DataSourceOptions = {
  type: 'better-sqlite3',
  database: `./data/sqlite/test.${Math.random()}.db`,
  synchronize: true,
  dropSchema: false,
  entities: ['./src/**/infrastructure/database/**/*.schema.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSourceOptions: DataSourceOptions = (() => {
  if (process.env.NODE_ENV === ENVIRONMENT.TEST) {
    return test;
  }

  if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
    return development;
  }

  if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
    return production;
  }

  throw new Error(
    'Invalid NODE_ENV. Must be one of development, test, or production.',
  );
})();

export default new DataSource({
  ...dataSourceOptions,
  entities: ['./src/**/infrastructure/database/**/*.schema.ts'],
  migrations: ['./data/migrations/**/*.ts'],
});
