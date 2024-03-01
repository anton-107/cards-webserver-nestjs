"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const space_service_1 = require("../../space/space.service");
const auth_guard_1 = require("../auth.guard");
let PermissionsGuard = PermissionsGuard_1 = class PermissionsGuard {
    constructor(reflector, spaceService) {
        this.reflector = reflector;
        this.spaceService = spaceService;
        this.logger = new common_1.Logger(PermissionsGuard_1.name);
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.get("permissions", context.getHandler());
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const username = request[auth_guard_1.USERNAME_REQUEST_PROPERTY]; // Assuming user is attached to request in previous AuthGuard
        return this.hasPermissions(requiredPermissions, {
            username,
            spaceIDInPathParam: request.params.spaceID,
            spaceIDInBody: request.body.spaceID,
        });
    }
    async hasPermissions(requiredPermissions, request) {
        let hasPermission = null;
        for (const i in requiredPermissions) {
            const permission = requiredPermissions[i];
            if (permission === "list_cards_in_requested_space") {
                hasPermission = await this.checkSpaceReadPermissions(request.username, request.spaceIDInPathParam);
            }
            if (permission === "create_card") {
                hasPermission = await this.checkSpaceWritePermissions(request.username, request.spaceIDInBody);
            }
            if (permission === "update_card") {
                hasPermission = await this.checkSpaceWritePermissions(request.username, request.spaceIDInBody);
            }
            if (permission === "remove_card") {
                hasPermission = await this.checkSpaceRemovePermissions(request.username, request.spaceIDInPathParam);
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
    async checkSpaceReadPermissions(username, spaceID) {
        const space = await this.spaceService.findOne(spaceID);
        if (space && space.owner === username) {
            return true;
        }
        return false;
    }
    async checkSpaceRemovePermissions(username, spaceID) {
        const space = await this.spaceService.findOne(spaceID);
        if (space && space.owner === username) {
            return true;
        }
        return false;
    }
    async checkSpaceWritePermissions(username, spaceID) {
        const space = await this.spaceService.findOne(spaceID);
        if (space && space.owner === username) {
            return true;
        }
        return false;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        space_service_1.SpaceService])
], PermissionsGuard);
