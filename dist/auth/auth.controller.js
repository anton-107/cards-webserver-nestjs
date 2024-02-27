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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
const bearer_token_extractor_service_1 = require("./bearer-token-extractor.service");
const constants_1 = require("./constants");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService, tokenExtractor) {
        this.authService = authService;
        this.tokenExtractor = tokenExtractor;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async signIn(body, response) {
        this.logger.verbose("Sign in attempt ", body.login);
        try {
            const accessToken = await this.authService.signIn(body.login, body.password);
            return {
                bearerToken: accessToken,
            };
        }
        catch (error) {
            this.logger.warn("Failed sign in attempt", {
                body,
                error: String(error),
            });
            response.status(common_1.HttpStatus.FORBIDDEN);
            return {
                signInResult: false,
                message: "Authentication failed. Please check your user name and password and try again.",
            };
        }
    }
    async checkIdentity(request) {
        const bearerToken = this.tokenExtractor.extractTokenFromRequest(request);
        if (!bearerToken) {
            return {
                isAuthenticated: false,
                username: "",
            };
        }
        const authenticationResult = await this.authService.authenticate(bearerToken);
        return {
            isAuthenticated: authenticationResult.isAuthenticated,
            username: authenticationResult.username || "",
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("/signin"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignInRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)("/whoami"),
    (0, swagger_1.ApiBearerAuth)(constants_1.AUTHORIZATION_HEADER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkIdentity", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)({
        path: "/auth",
        version: "1",
    }),
    (0, swagger_1.ApiTags)("CardsAuth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        bearer_token_extractor_service_1.BearerTokenExtractor])
], AuthController);
