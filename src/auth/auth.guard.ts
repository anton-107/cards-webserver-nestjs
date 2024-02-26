import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";

import { BearerTokenExtractor } from "./bearer-token-extractor.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authenticator: Authenticator,
    private tokenExtractor: BearerTokenExtractor,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.tokenExtractor.extractTokenFromRequest(request);
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const authResult = await this.authenticator.authenticate(accessToken);
      if (authResult.errorMessage) {
        throw new UnauthorizedException(authResult.errorMessage);
      }
      if (!authResult.isAuthenticated || !authResult.username) {
        throw new UnauthorizedException();
      }
      request["username"] = authResult.username;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
