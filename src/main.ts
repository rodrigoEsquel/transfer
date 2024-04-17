import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { configApiDocumentation } from './config/doc.config';

import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configApiDocumentation(app);

  await app.listen(app.get(ConfigService).get('server.port'));
}
bootstrap();
