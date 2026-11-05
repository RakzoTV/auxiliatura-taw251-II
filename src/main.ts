import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
  .setTitle("Aux Backend II")
  .setDescription("Api de reservas de habitaciones de hotel")
  .setVersion("1.0")
  .build();

  //SWAGGER
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document)

  //SCALAR
  app.use(
    "/reference",
    apiReference({
      title: "Aux Backend II",
      content: document,
      theme: "halloween"
    })
  )

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
