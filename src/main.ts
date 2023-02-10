import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
const mainLogger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.PREFIX);
  const documentOptions = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE)
    .setDescription(process.env.APP_TITLE)
    .setVersion(process.env.VERSION)
    .setBasePath(process.env.PREFIX)
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup(process.env.SWAGGER_URL, app, document);
  app.enableCors();
  await app.listen(process.env.PORT);
  mainLogger.log(`App listening on port ${process.env.PORT}`);
}
bootstrap();
