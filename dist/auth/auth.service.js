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
exports.AuthService = exports.AuthenticationError = void 0;
const common_1 = require("@nestjs/common");
const authenticator_1 = require("authentication-module/dist/authenticator");
class AuthenticationError extends Error {
    constructor(failReason) {
        super(`Authentication error: ${failReason}`);
        this.failReason = failReason;
    }
}
exports.AuthenticationError = AuthenticationError;
let AuthService = class AuthService {
    constructor(authenticator) {
        this.authenticator = authenticator;
    }
    async signIn(username, password) {
        const authenticationResult = await this.authenticator.signIn(username, password);
        if (!authenticationResult.accessToken) {
            if (authenticationResult.authenticationFailedReason) {
                throw new AuthenticationError(authenticationResult.authenticationFailedReason);
            }
            throw new AuthenticationError("Authentication failed");
        }
        return authenticationResult.accessToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [authenticator_1.Authenticator])
], AuthService);
