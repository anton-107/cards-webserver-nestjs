import { Authenticator, PasswordHashingFunction, UserStore } from "authentication-module/dist/authenticator";
export declare class ScryptJWTAuthenticator extends Authenticator {
    private userStore;
    private passwordHashingFunction;
    constructor(userStore: UserStore, passwordHashingFunction: PasswordHashingFunction);
}
//# sourceMappingURL=authenticator.provider.d.ts.map