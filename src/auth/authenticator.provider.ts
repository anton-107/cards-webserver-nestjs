import { Inject, Injectable } from "@nestjs/common";
import {
  Authenticator,
  PasswordHashingFunction,
  UserStore,
} from "authentication-module/dist/authenticator";
import {
  JWTSerializer,
  SimpleStringProvider,
  StandardJwtImplementation,
} from "authentication-module/dist/jwt-serializer";

@Injectable()
export class ScryptJWTAuthenticator extends Authenticator {
  constructor(
    @Inject("UserStore") private userStore: UserStore,
    @Inject("PasswordHashingFunction")
    private passwordHashingFunction: PasswordHashingFunction,
  ) {
    super({
      userStore,
      passwordHashingFunction,
      authTokensSerializer: new JWTSerializer({
        jwt: new StandardJwtImplementation(),
        secretKeyProvider: new SimpleStringProvider(String(Math.random())),
      }),
    });
  }
}
