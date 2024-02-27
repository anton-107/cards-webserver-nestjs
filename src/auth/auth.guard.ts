import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Authenticator } from "authentication-module/dist/authenticator";

import { BearerTokenExtractor } from "./bearer-token-extractor.service";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private authenticator: Authenticator,
    private tokenExtractor: BearerTokenExtractor,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.tokenExtractor.extractTokenFromRequest(request);
    if (!accessToken) {
      this.logger.verbose("Authentication failed: empty auth token");
      return false;
    }
    try {
      const authResult = await this.authenticator.authenticate(accessToken);
      if (authResult.errorMessage) {
        this.logger.verbose(
          `Authentication failed: ${authResult.errorMessage}`,
        );
        return false;
      }
      if (!authResult.isAuthenticated || !authResult.username) {
        this.logger.verbose(`Authentication failed: unknown reason`);
        return false;
      }
      request["username"] = authResult.username;
      return true;
    } catch (err) {
      this.logger.verbose(`Authentication failed: ${err}`);
      return false;
    }
  }
}
