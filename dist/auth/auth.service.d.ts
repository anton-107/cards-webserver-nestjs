import { Authenticator } from "authentication-module/dist/authenticator";
type AccessToken = string;
export declare class AuthenticationError extends Error {
    failReason: string;
    constructor(failReason: string);
}
export declare class AuthService {
    private authenticator;
    constructor(authenticator: Authenticator);
    signIn(username: string, password: string): Promise<AccessToken>;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map