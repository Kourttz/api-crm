import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function initSwagger(app: INestApplication) {

  const apiPrefix = process.env.API_PREFIX || '';

  const config = new DocumentBuilder()
    .setTitle('API CRM')
    .setDescription('API para gerenciamento de clientes e leads')
    .setVersion('2.0')
    .addServer(apiPrefix)
    .build();

  const document = SwaggerModule. createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

}
