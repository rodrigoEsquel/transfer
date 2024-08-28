import { INestApplication, ValidationPipe } from '@nestjs/common';

export const configApp = (app: INestApplication) => {
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};
