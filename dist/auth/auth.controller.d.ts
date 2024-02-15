import { Response } from "express";
import { SignInErrorResponse, SignInRequest, SignInSuccessResponse } from "./auth.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(body: SignInRequest, response: Response): Promise<SignInSuccessResponse | SignInErrorResponse>;
}
//# sourceMappingURL=auth.controller.d.ts.map