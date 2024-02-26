import { Injectable } from "@nestjs/common";
import { Request } from "express";

import { INCOMING_HTTP_HEADER } from "./constants";

@Injectable()
export class BearerTokenExtractor {
  public extractTokenFromRequest(request: Request): string | undefined {
    const [type, scheme, token] = String(
      request.headers[INCOMING_HTTP_HEADER],
    ).split(" ");
    return type === "Bearer" ? `${scheme} ${token}` : undefined;
  }
}
