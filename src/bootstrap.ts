import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";
import { AUTHORIZATION_HEADER } from "./auth/constants";

export async function buildNestApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get("CORS_ORIGIN"), // Dynamically set CORS origin from .env
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: `Content-Type, Accept, Access-Control-Allow-Headers, ${AUTHORIZATION_HEADER}`,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  return app;
}

export function buildSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle("Cards API")
    .setDescription("The api to manage cards")
    .setVersion("1.0")
    .addTag("cards")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "jwt" },
      AUTHORIZATION_HEADER, // This is the name of the security scheme
    )
    .build();
  return SwaggerModule.createDocument(app, config);
}

export async function bootstrap() {
  const app = await buildNestApp();
  const swaggerDocument = buildSwaggerDocument(app);

  SwaggerModule.setup("swagger-api", app, swaggerDocument);
  await app.listen(3000);
}
