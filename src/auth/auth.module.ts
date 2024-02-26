import { Module } from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";
import { ScryptHashingFunction } from "authentication-module/dist/scrypt-hashing";

import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { ScryptJWTAuthenticator } from "./authenticator.provider";
import { BearerTokenExtractor } from "./bearer-token-extractor.service";
import { InMemoryUserRepository } from "./user.repository";

const userRepository = new InMemoryUserRepository();
const hashGenerator = new ScryptHashingFunction();

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
      useValue: hashGenerator,
    },
    {
      provide: "UserStore",
      useValue: userRepository,
    },
    AuthGuard,
    BearerTokenExtractor,
  ],
  exports: [Authenticator, BearerTokenExtractor],
})
export class AuthModule {
  constructor() {
    this.generateDemoUsers();
  }
  async generateDemoUsers(): Promise<void> {
    userRepository.addUser({
      username: "testuser1",
      passwordHash: await hashGenerator.generateHash("password-1"),
    });
  }
}
