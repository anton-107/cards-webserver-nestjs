import { Authenticator } from "authentication-module/dist/authenticator";
type AccessToken = string;
export declare class AuthenticationError extends Error {
    failReason: string;
    constructor(failReason: string);
}
export interface AuthenticationResult {
    isAuthenticated: boolean;
    username?: string;
    errorMessage?: string;
}
export declare class AuthService {
    private authenticator;
    constructor(authenticator: Authenticator);
    signIn(username: string, password: string): Promise<AccessToken>;
    authenticate(bearerToken: string): Promise<AuthenticationResult>;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map