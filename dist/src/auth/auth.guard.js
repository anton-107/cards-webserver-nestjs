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
var AuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.USERNAME_REQUEST_PROPERTY = void 0;
const common_1 = require("@nestjs/common");
const authenticator_1 = require("authentication-module/dist/authenticator");
const bearer_token_extractor_service_1 = require("./bearer-token-extractor.service");
exports.USERNAME_REQUEST_PROPERTY = "USERNAME_REQUEST_PROPERTY";
let AuthGuard = AuthGuard_1 = class AuthGuard {
    constructor(authenticator, tokenExtractor) {
        this.authenticator = authenticator;
        this.tokenExtractor = tokenExtractor;
        this.logger = new common_1.Logger(AuthGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.tokenExtractor.extractTokenFromRequest(request);
        if (!accessToken) {
            this.logger.verbose("Authentication failed: empty auth token");
            return false;
        }
        try {
            const authResult = await this.authenticator.authenticate(accessToken);
            if (authResult.errorMessage) {
                this.logger.verbose(`Authentication failed: ${authResult.errorMessage}`);
                return false;
            }
            if (!authResult.isAuthenticated || !authResult.username) {
                this.logger.verbose(`Authentication failed: unknown reason`);
                return false;
            }
            request[exports.USERNAME_REQUEST_PROPERTY] = authResult.username;
            return true;
        }
        catch (err) {
            this.logger.verbose(`Authentication failed: ${err}`);
            return false;
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = AuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [authenticator_1.Authenticator,
        bearer_token_extractor_service_1.BearerTokenExtractor])
], AuthGuard);
