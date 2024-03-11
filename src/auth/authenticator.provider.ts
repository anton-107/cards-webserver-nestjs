import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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

export const AUTH_TOKEN_EXPIRATION_HOURS = "AUTH_TOKEN_EXPIRATION_HOURS";

@Injectable()
export class ScryptJWTAuthenticator extends Authenticator {
  private readonly logger = new Logger(ScryptJWTAuthenticator.name);

  constructor(
    @Inject("UserStore") userStore: UserStore,
    @Inject("PasswordHashingFunction")
    passwordHashingFunction: PasswordHashingFunction,
    configService: ConfigService,
  ) {
    const expiresInHours =
      configService.get<number>(AUTH_TOKEN_EXPIRATION_HOURS) || 1;

    super({
      userStore,
      passwordHashingFunction,
      authTokensSerializer: new JWTSerializer({
        jwt: new StandardJwtImplementation(),
        secretKeyProvider: new SimpleStringProvider(String(Math.random())),
        expiresInSeconds: expiresInHours * 3600,
      }),
    });

    this.logger.verbose(
      `Initialized ScryptJWTAuthenticator to serialize JWT tokens that expire in ${expiresInHours} hour(s)`,
    );
  }
}
