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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScryptJWTAuthenticator = void 0;
const common_1 = require("@nestjs/common");
const authenticator_1 = require("authentication-module/dist/authenticator");
const jwt_serializer_1 = require("authentication-module/dist/jwt-serializer");
let ScryptJWTAuthenticator = class ScryptJWTAuthenticator extends authenticator_1.Authenticator {
    constructor(userStore, passwordHashingFunction) {
        super({
            userStore,
            passwordHashingFunction,
            authTokensSerializer: new jwt_serializer_1.JWTSerializer({
                jwt: new jwt_serializer_1.StandardJwtImplementation(),
                secretKeyProvider: new jwt_serializer_1.SimpleStringProvider(String(Math.random())),
            })
        });
        this.userStore = userStore;
        this.passwordHashingFunction = passwordHashingFunction;
    }
};
exports.ScryptJWTAuthenticator = ScryptJWTAuthenticator;
exports.ScryptJWTAuthenticator = ScryptJWTAuthenticator = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserStore')),
    __param(1, (0, common_1.Inject)('PasswordHashingFunction')),
    __metadata("design:paramtypes", [Object, Object])
], ScryptJWTAuthenticator);
