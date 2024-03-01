import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { Authenticator } from "authentication-module/dist/authenticator";
import { ScryptHashingFunction } from "authentication-module/dist/scrypt-hashing";

import { SpaceModule } from "../space/space.module";
import { SpaceService } from "../space/space.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { ScryptJWTAuthenticator } from "./authenticator.provider";
import { BearerTokenExtractor } from "./bearer-token-extractor.service";
import {
  DynamoDBUserRepository,
  InMemoryUserRepository,
  USER_STORE_TYPE,
  UserStoreType,
} from "./user.repository";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: Authenticator,
      useClass: ScryptJWTAuthenticator,
    },
    {
      provide: "PasswordHashingFunction",
      useClass: ScryptHashingFunction,
    },
    {
      provide: "UserStore",
      inject: [ConfigService, ModuleRef],
      useFactory: (configService: ConfigService, moduleRef: ModuleRef) => {
        const userStoreType = configService.get<UserStoreType>(USER_STORE_TYPE);
        if (userStoreType === "dynamodb") {
          return moduleRef.create(DynamoDBUserRepository);
        }

        return moduleRef.create(InMemoryUserRepository);
      },
    },
    AuthGuard,
    BearerTokenExtractor,
    SpaceService,
  ],
  exports: [Authenticator, BearerTokenExtractor],
  imports: [forwardRef(() => SpaceModule), ConfigModule],
})
export class AuthModule {
  constructor() {}
}
