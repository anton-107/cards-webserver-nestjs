import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";

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
  @HttpCode(200)
  public async signIn(
    @Body() body: SignInRequest,
    @Res({ passthrough: true }) response: Response,
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
      response.status(HttpStatus.FORBIDDEN);
      return {
        signInResult: false,
        message:
          "Authentication failed. Please check your user name and password and try again.",
      };
    }
  }
}
