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
    .setTitle("Aux II Backend")
    .setDescription("Decumentacion de la api de reservas de habitacion del aux")
    .setVersion("1.0")
    .addBearerAuth()
    .build();


  // Swagger
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document);

  // Scalar
  app.use(
    "/reference",
    apiReference({
      content: document,
      theme: "elysiajs"
    })
  )

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
