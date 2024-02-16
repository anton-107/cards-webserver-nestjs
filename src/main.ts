import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Cards API")
    .setDescription("The api to manage cards")
    .setVersion("1.0")
    .addTag("cards")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger-api", app, document);

  await app.listen(3000);
}
bootstrap();
