import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";
import { Request } from "express";

import { INCOMING_HTTP_HEADER } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authenticator: Authenticator) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
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

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, scheme, token] = String(
      request.headers[INCOMING_HTTP_HEADER],
    ).split(" ");
    return type === "Bearer" ? `${scheme} ${token}` : undefined;
  }
}
