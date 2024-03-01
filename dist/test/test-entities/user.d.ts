import { App } from "supertest/types";
export declare class User {
    readonly login: string;
    private password;
    private bearerToken;
    constructor(login: string, password: string);
    get authorizationHeader(): string;
    signIn(appServer: App): Promise<void>;
}
//# sourceMappingURL=user.d.ts.map