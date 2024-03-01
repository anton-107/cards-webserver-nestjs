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
exports.SpaceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const constants_1 = require("../auth/constants");
const create_space_dto_1 = require("./dto/create-space.dto");
const update_space_dto_1 = require("./dto/update-space.dto");
const space_service_1 = require("./space.service");
let SpaceController = class SpaceController {
    constructor(spaceService) {
        this.spaceService = spaceService;
    }
    create(createSpaceDto, request) {
        return this.spaceService.create(createSpaceDto, request[auth_guard_1.USERNAME_REQUEST_PROPERTY]);
    }
    async findAll(request) {
        return {
            spaces: await this.spaceService.findAllOwnedBy(request[auth_guard_1.USERNAME_REQUEST_PROPERTY]),
        };
    }
    findOne(id) {
        return this.spaceService.findOne(id);
    }
    update(id, updateSpaceDto) {
        return this.spaceService.update(+id, updateSpaceDto);
    }
    remove(id) {
        return this.spaceService.remove(+id);
    }
};
exports.SpaceController = SpaceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_space_dto_1.CreateSpaceDto, Object]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_space_dto_1.UpdateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "remove", null);
exports.SpaceController = SpaceController = __decorate([
    (0, common_1.Controller)("space"),
    (0, swagger_1.ApiTags)("SpaceCRUD"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    })),
    (0, swagger_1.ApiBearerAuth)(constants_1.AUTHORIZATION_HEADER),
    __metadata("design:paramtypes", [space_service_1.SpaceService])
], SpaceController);
