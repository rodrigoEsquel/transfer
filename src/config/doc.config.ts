import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configApiDocumentation(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Transfer API')
    .setDescription('Basic API for creating transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
}
