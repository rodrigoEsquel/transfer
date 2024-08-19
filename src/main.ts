import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { configApp } from './config/app.config';
import { configApiDocumentation } from './config/doc.config';

import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configApp(app);
  configApiDocumentation(app);

  await app.listen(app.get(ConfigService).get('server.port'));
}

bootstrap();
