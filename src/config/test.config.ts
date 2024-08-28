import { Test, TestingModule } from '@nestjs/testing';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  Builder,
  Loader,
  Parser,
  Resolver,
  fixturesIterator,
} from 'typeorm-fixtures-cli/dist';

import { AppModule } from '../module/app.module';

import {
  HASH_PROVIDER,
  IHashProvider,
} from '../module/common/application/interface/hash-provider.interface';

export const loadFixtures = async (
  fixturesPath: string,
  datasourceOptions: DataSourceOptions,
) => {
  let dataSource: DataSource | undefined = undefined;

  try {
    dataSource = new DataSource(datasourceOptions);

    await dataSource.initialize();
    await dataSource.synchronize(true);

    const loader = new Loader();
    loader.load(resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(dataSource, new Parser(), false);

    for (const fixture of fixturesIterator(fixtures)) {
      const entity: any = await builder.build(fixture);
      await dataSource.getRepository(fixture.entity).save(entity);
    }
  } catch (err) {
    throw err;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
    }
  }
};

export const hashProviderMock: jest.MockedObject<IHashProvider> = {
  hash: jest.fn().mockImplementation(async (payload) => payload),
  verifyHash: jest
    .fn()
    .mockImplementation(async (payload, secret) => payload === secret),
};

export const initTestApp = (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(HASH_PROVIDER)
    .useValue(hashProviderMock)
    .compile();
};
