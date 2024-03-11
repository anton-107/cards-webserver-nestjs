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
var ScryptJWTAuthenticator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScryptJWTAuthenticator = exports.AUTH_TOKEN_EXPIRATION_HOURS = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const authenticator_1 = require("authentication-module/dist/authenticator");
const jwt_serializer_1 = require("authentication-module/dist/jwt-serializer");
exports.AUTH_TOKEN_EXPIRATION_HOURS = 'AUTH_TOKEN_EXPIRATION_HOURS';
let ScryptJWTAuthenticator = ScryptJWTAuthenticator_1 = class ScryptJWTAuthenticator extends authenticator_1.Authenticator {
    constructor(userStore, passwordHashingFunction, configService) {
        const expiresInHours = configService.get(exports.AUTH_TOKEN_EXPIRATION_HOURS) || 1;
        super({
            userStore,
            passwordHashingFunction,
            authTokensSerializer: new jwt_serializer_1.JWTSerializer({
                jwt: new jwt_serializer_1.StandardJwtImplementation(),
                secretKeyProvider: new jwt_serializer_1.SimpleStringProvider(String(Math.random())),
                expiresInSeconds: expiresInHours / 3600
            }),
        });
        this.logger = new common_1.Logger(ScryptJWTAuthenticator_1.name);
        this.logger.verbose(`Initialized ScryptJWTAuthenticator to serialize JWT tokens that expire in ${expiresInHours} hour(s)`);
        ;
    }
};
exports.ScryptJWTAuthenticator = ScryptJWTAuthenticator;
exports.ScryptJWTAuthenticator = ScryptJWTAuthenticator = ScryptJWTAuthenticator_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("UserStore")),
    __param(1, (0, common_1.Inject)("PasswordHashingFunction")),
    __metadata("design:paramtypes", [Object, Object, config_1.ConfigService])
], ScryptJWTAuthenticator);
