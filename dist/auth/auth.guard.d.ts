import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";
import { BearerTokenExtractor } from "./bearer-token-extractor.service";
export declare class AuthGuard implements CanActivate {
    private authenticator;
    private tokenExtractor;
    constructor(authenticator: Authenticator, tokenExtractor: BearerTokenExtractor);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=auth.guard.d.ts.map