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
exports.CardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const constants_1 = require("../auth/constants");
const card_service_1 = require("./card.service");
const card_identity_dto_1 = require("./dto/card-identity.dto");
const create_card_dto_1 = require("./dto/create-card.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
const update_card_attributes_dto_1 = require("./dto/update-card-attributes.dto");
const validate_type_pipe_1 = require("./pipes/validate-type.pipe");
let CardController = class CardController {
    constructor(cardService) {
        this.cardService = cardService;
    }
    async create(type, createCardDto) {
        return await this.cardService.create(type, createCardDto);
    }
    async findAll(type) {
        return await this.cardService.findAllOfType("space-1", type);
    }
    async findChildren(type, parentID) {
        return await this.cardService.findAllOfTypeForParent("space-1", type, parentID);
    }
    async findOne(type, id) {
        const card = await this.cardService.findOneOfType("space-1", type, id);
        if (!card) {
            throw new common_1.NotFoundException(`Card with ID ${id} not found.`);
        }
        return card;
    }
    async update(type, id, updateCardDto) {
        return await this.cardService.update(new card_identity_dto_1.CardIdentity("space-1", type, id), updateCardDto);
    }
    async updateCardAttributes(type, id, updateCardAttributesDto) {
        return await this.cardService.updateAttributes(new card_identity_dto_1.CardIdentity("space-1", type, id), updateCardAttributesDto);
    }
    remove(type, id) {
        return this.cardService.remove("space-1", type, id);
    }
};
exports.CardController = CardController;
__decorate([
    (0, common_1.Post)("/:type"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("/:type"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/:type/children-of/:parentID"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __param(1, (0, common_1.Param)("parentID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "findChildren", null);
__decorate([
    (0, common_1.Get)("/:type/:id"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)("/:type/:id"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)("/:type/:id/attributes"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_card_attributes_dto_1.UpdateCardAttributesDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "updateCardAttributes", null);
__decorate([
    (0, common_1.Delete)("/:type/:id"),
    __param(0, (0, common_1.Param)("type", new validate_type_pipe_1.ValidateTypePipe())),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CardController.prototype, "remove", null);
exports.CardController = CardController = __decorate([
    (0, common_1.Controller)("card"),
    (0, swagger_1.ApiTags)("CardsCRUD"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(constants_1.AUTHORIZATION_HEADER),
    __metadata("design:paramtypes", [card_service_1.CardService])
], CardController);
