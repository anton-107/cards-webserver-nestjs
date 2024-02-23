"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app/app.module");
const constants_1 = require("./auth/constants");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get("CORS_ORIGIN"), // Dynamically set CORS origin from .env
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: `Content-Type, Accept, Access-Control-Allow-Headers, ${constants_1.AUTHORIZATION_HEADER}`,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Cards API")
        .setDescription("The api to manage cards")
        .setVersion("1.0")
        .addTag("cards")
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'jwt' }, constants_1.AUTHORIZATION_HEADER)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("swagger-api", app, document);
    await app.listen(3000);
}
bootstrap();
