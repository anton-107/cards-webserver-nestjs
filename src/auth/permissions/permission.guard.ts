import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { SpaceService } from "../../space/space.service";
import { USERNAME_REQUEST_PROPERTY } from "../auth.guard";
import { Permission } from "./permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private spaceService: SpaceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<Permission[]>(
      "permissions",
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const username = request[USERNAME_REQUEST_PROPERTY]; // Assuming user is attached to request in previous AuthGuard

    return this.hasPermissions(
      requiredPermissions,
      username,
      request.params.spaceID,
    );
  }

  private async hasPermissions(
    requiredPermissions: Permission[],
    username: string,
    spaceID: string,
  ): Promise<boolean> {
    let hasPermission: boolean | null = null;
    for (const i in requiredPermissions) {
      const permission = requiredPermissions[i];
      if (permission === "list_cards_in_requested_space") {
        hasPermission = await this.checkSpaceReadPermissions(username, spaceID);
      }
      if (hasPermission === false) {
        return false;
      }
    }
    if (hasPermission === true) {
      return true;
    }
    return false;
  }

  private async checkSpaceReadPermissions(
    username: string,
    spaceID: string,
  ): Promise<boolean> {
    const space = await this.spaceService.findOne(spaceID);
    if (space && space.owner === username) {
      return true;
    }
    return false;
  }
}
