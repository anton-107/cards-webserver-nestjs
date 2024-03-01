import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SpaceService } from "../../space/space.service";
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private spaceService;
    private readonly logger;
    constructor(reflector: Reflector, spaceService: SpaceService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private hasPermissions;
    private checkSpaceReadPermissions;
    private checkSpaceRemovePermissions;
    private checkSpaceWritePermissions;
}
//# sourceMappingURL=permission.guard.d.ts.map