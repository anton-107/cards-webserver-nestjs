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
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const authenticator_1 = require("authentication-module/dist/authenticator");
const scrypt_hashing_1 = require("authentication-module/dist/scrypt-hashing");
const space_module_1 = require("../space/space.module");
const space_service_1 = require("../space/space.service");
const auth_controller_1 = require("./auth.controller");
const auth_guard_1 = require("./auth.guard");
const auth_service_1 = require("./auth.service");
const authenticator_provider_1 = require("./authenticator.provider");
const bearer_token_extractor_service_1 = require("./bearer-token-extractor.service");
const user_repository_1 = require("./user.repository");
let AuthModule = class AuthModule {
    constructor() { }
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
                useClass: scrypt_hashing_1.ScryptHashingFunction,
            },
            {
                provide: "UserStore",
                inject: [config_1.ConfigService, core_1.ModuleRef],
                useFactory: (configService, moduleRef) => {
                    const userStoreType = configService.get(user_repository_1.USER_STORE_TYPE);
                    if (userStoreType === "dynamodb") {
                        return moduleRef.create(user_repository_1.DynamoDBUserRepository);
                    }
                    return moduleRef.create(user_repository_1.InMemoryUserRepository);
                },
            },
            auth_guard_1.AuthGuard,
            bearer_token_extractor_service_1.BearerTokenExtractor,
            space_service_1.SpaceService,
        ],
        exports: [authenticator_1.Authenticator, bearer_token_extractor_service_1.BearerTokenExtractor],
        imports: [(0, common_1.forwardRef)(() => space_module_1.SpaceModule), config_1.ConfigModule],
    }),
    __metadata("design:paramtypes", [])
], AuthModule);
