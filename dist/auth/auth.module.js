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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const authenticator_1 = require("authentication-module/dist/authenticator");
const scrypt_hashing_1 = require("authentication-module/dist/scrypt-hashing");
const auth_controller_1 = require("./auth.controller");
const auth_guard_1 = require("./auth.guard");
const auth_service_1 = require("./auth.service");
const authenticator_provider_1 = require("./authenticator.provider");
const user_repository_1 = require("./user.repository");
const bearer_token_extractor_service_1 = require("./bearer-token-extractor.service");
const userRepository = new user_repository_1.InMemoryUserRepository();
const hashGenerator = new scrypt_hashing_1.ScryptHashingFunction();
let AuthModule = class AuthModule {
    constructor() {
        this.generateDemoUsers();
    }
    async generateDemoUsers() {
        userRepository.addUser({
            username: "testuser1",
            passwordHash: await hashGenerator.generateHash("password-1"),
        });
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: authenticator_1.Authenticator,
                useClass: authenticator_provider_1.ScryptJWTAuthenticator,
            },
            {
                provide: "PasswordHashingFunction",
                useValue: hashGenerator,
            },
            {
                provide: "UserStore",
                useValue: userRepository,
            },
            auth_guard_1.AuthGuard,
            bearer_token_extractor_service_1.BearerTokenExtractor,
        ],
        exports: [authenticator_1.Authenticator, bearer_token_extractor_service_1.BearerTokenExtractor],
    }),
    __metadata("design:paramtypes", [])
], AuthModule);
