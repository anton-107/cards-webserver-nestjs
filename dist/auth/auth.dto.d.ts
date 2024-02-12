interface SignInRequest {
  login: string;
  password: string;
}
interface SignInSuccessResponse {
  bearerToken: string;
}
interface SignInErrorResponse {
  signInResult: boolean;
  message: string;
}
//# sourceMappingURL=auth.dto.d.ts.map
