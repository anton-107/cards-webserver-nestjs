import { INestApplication } from "@nestjs/common";
import { OpenAPIObject } from "@nestjs/swagger";
export declare function buildNestApp(): Promise<INestApplication>;
export declare function buildSwaggerDocument(app: INestApplication): OpenAPIObject;
export declare function bootstrap(): Promise<void>;
//# sourceMappingURL=bootstrap.d.ts.map