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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("../auth.guard");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.get('permissions', context.getHandler());
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request[auth_guard_1.USERNAME_REQUEST_PROPERTY]; // Assuming user is attached to request in previous AuthGuard
        let hasPermission = null;
        for (let permission in requiredPermissions) {
            if (permission === 'list_cards_in_requested_space') {
                const spaceID = request.params.spaceID;
                hasPermission = await this.checkSpaceReadPermissions(user, spaceID);
                if (hasPermission === false) {
                    return false;
                }
            }
        }
        if (hasPermission === true) {
            return true;
        }
        return false;
    }
    async checkSpaceReadPermissions(user, spaceID) {
        console.log('checkSpaceReadPermissions', user, spaceID);
        return false;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
