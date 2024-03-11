import { ConfigService } from "@nestjs/config";
import { Authenticator, PasswordHashingFunction, UserStore } from "authentication-module/dist/authenticator";
export declare const AUTH_TOKEN_EXPIRATION_HOURS = "AUTH_TOKEN_EXPIRATION_HOURS";
export declare class ScryptJWTAuthenticator extends Authenticator {
    private readonly logger;
    constructor(userStore: UserStore, passwordHashingFunction: PasswordHashingFunction, configService: ConfigService);
}
//# sourceMappingURL=authenticator.provider.d.ts.map