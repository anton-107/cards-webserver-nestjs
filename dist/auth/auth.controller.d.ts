import { Request, Response } from "express";
import { IdentityResponse, SignInErrorResponse, SignInRequest, SignInSuccessResponse } from "./auth.dto";
import { AuthService } from "./auth.service";
import { BearerTokenExtractor } from "./bearer-token-extractor.service";
export declare class AuthController {
    private authService;
    private tokenExtractor;
    constructor(authService: AuthService, tokenExtractor: BearerTokenExtractor);
    signIn(body: SignInRequest, response: Response): Promise<SignInSuccessResponse | SignInErrorResponse>;
    checkIdentity(request: Request): Promise<IdentityResponse>;
}
//# sourceMappingURL=auth.controller.d.ts.map