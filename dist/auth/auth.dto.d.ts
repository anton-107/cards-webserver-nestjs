export declare class SignInRequest {
    login: string;
    password: string;
}
export interface SignInSuccessResponse {
    bearerToken: string;
}
export interface SignInErrorResponse {
    signInResult: boolean;
    message: string;
}
//# sourceMappingURL=auth.dto.d.ts.map