import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import {
  IdentityResponse,
  SignInErrorResponse,
  SignInRequest,
  SignInSuccessResponse,
} from "./auth.dto";
import { AuthService } from "./auth.service";
import { BearerTokenExtractor } from "./bearer-token-extractor.service";
import { AUTHORIZATION_HEADER } from "./constants";

@Controller({
  path: "/auth",
  version: "1",
})
@ApiTags("CardsAuth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private tokenExtractor: BearerTokenExtractor,
  ) {}

  @Post("/signin")
  @HttpCode(200)
  public async signIn(
    @Body() body: SignInRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignInSuccessResponse | SignInErrorResponse> {
    this.logger.verbose("Sign in attempt ", body.login);
    try {
      const accessToken = await this.authService.signIn(
        body.login,
        body.password,
      );
      return {
        bearerToken: accessToken,
      };
    } catch (error) {
      this.logger.warn("Failed sign in attempt", {
        body,
        error: String(error),
      });
      response.status(HttpStatus.FORBIDDEN);
      return {
        signInResult: false,
        message:
          "Authentication failed. Please check your user name and password and try again.",
      };
    }
  }

  @Get("/whoami")
  @ApiBearerAuth(AUTHORIZATION_HEADER)
  public async checkIdentity(
    @Req() request: Request,
  ): Promise<IdentityResponse> {
    const bearerToken = this.tokenExtractor.extractTokenFromRequest(request);
    if (!bearerToken) {
      return {
        isAuthenticated: false,
        username: "",
      };
    }

    const authenticationResult =
      await this.authService.authenticate(bearerToken);

    return {
      isAuthenticated: authenticationResult.isAuthenticated,
      username: authenticationResult.username || "",
    };
  }
}
