import { Module } from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";
import { ScryptHashingFunction } from "authentication-module/dist/scrypt-hashing";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ScryptJWTAuthenticator } from "./authenticator.provider";
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
  ],
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
