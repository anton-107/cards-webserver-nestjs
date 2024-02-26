import { Injectable } from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";

type AccessToken = string;

export class AuthenticationError extends Error {
  constructor(public failReason: string) {
    super(`Authentication error: ${failReason}`);
  }
}

export interface AuthenticationResult {
  isAuthenticated: boolean;
  username?: string;
  errorMessage?: string;
}

@Injectable()
export class AuthService {
  constructor(private authenticator: Authenticator) {}
  public async signIn(
    username: string,
    password: string,
  ): Promise<AccessToken> {
    const authenticationResult = await this.authenticator.signIn(
      username,
      password,
    );
    if (!authenticationResult.accessToken) {
      if (authenticationResult.authenticationFailedReason) {
        throw new AuthenticationError(
          authenticationResult.authenticationFailedReason,
        );
      }
      throw new AuthenticationError("Authentication failed");
    }
    return authenticationResult.accessToken;
  }
  public async authenticate(
    bearerToken: string,
  ): Promise<AuthenticationResult> {
    return await this.authenticator.authenticate(bearerToken);
  }
}
