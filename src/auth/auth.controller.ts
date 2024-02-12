import { Body, Controller, Post } from "@nestjs/common";

import {
  SignInErrorResponse,
  SignInRequest,
  SignInSuccessResponse,
} from "./auth.dto";

@Controller({
  path: "/auth",
  version: "1",
})
export class AuthController {
  @Post("/signin")
  public async signIn(
    @Body() body: SignInRequest,
  ): Promise<SignInSuccessResponse | SignInErrorResponse> {
    return {
      signInResult: false,
      message: `Sign in failed with the following parameters: ${JSON.stringify(body)}`,
    };
  }
}
