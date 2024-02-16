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
const card_service_1 = require("./card.service");
const create_card_dto_1 = require("./dto/create-card.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
let CardController = class CardController {
    constructor(cardService) {
        this.cardService = cardService;
    }
    async create(createCardDto) {
        return await this.cardService.create(createCardDto);
    }
    async findAll() {
        return await this.cardService.findAll("space-1");
    }
    async findOne(id) {
        return await this.cardService.findOne("space-1", id);
    }
    update(id, updateCardDto) {
        return this.cardService.update("space-1", id, updateCardDto);
    }
    remove(id) {
        return this.cardService.remove("space-1", id);
    }
};
exports.CardController = CardController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", void 0)
], CardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CardController.prototype, "remove", null);
exports.CardController = CardController = __decorate([
    (0, common_1.Controller)("card"),
    __metadata("design:paramtypes", [card_service_1.CardService])
], CardController);
