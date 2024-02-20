import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get("CORS_ORIGIN"), // Dynamically set CORS origin from .env
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders:
      "Content-Type, Accept, Access-Control-Allow-Headers, Authorization",
    credentials: true,
  });
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
