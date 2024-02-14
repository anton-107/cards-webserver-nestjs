import { Body, Controller, Post } from "@nestjs/common";

import {
  SignInErrorResponse,
  SignInRequest,
  SignInSuccessResponse,
} from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller({
  path: "/auth",
  version: "1",
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signin")
  public async signIn(
    @Body() body: SignInRequest,
  ): Promise<SignInSuccessResponse | SignInErrorResponse> {
    try {
      const accessToken = await this.authService.signIn(
        body.login,
        body.password,
      );
      return {
        bearerToken: accessToken,
      };
    } catch (error) {
      // console.error(error);
      return {
        signInResult: false,
        message:
          "Authentication failed. Please check your user name and password and try again.",
      };
    }
  }
}
