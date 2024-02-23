import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Authenticator } from 'authentication-module/dist/authenticator';
export declare class AuthGuard implements CanActivate {
    private authenticator;
    constructor(authenticator: Authenticator);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
//# sourceMappingURL=auth.guard.d.ts.map