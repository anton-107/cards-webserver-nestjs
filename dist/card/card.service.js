"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const common_1 = require("@nestjs/common");
const cards_repository_1 = require("cards-datalayer-dynamodb/dist/cards-repository");
const entity_1 = require("cards-datalayer-dynamodb/dist/dynamodb-toolbox/entity");
const short_uuid_counter_1 = require("cards-datalayer-dynamodb/dist/short-uuid-counter");
const repository_1 = require("cards-model/dist/repository");
let CardService = class CardService {
    async create(createCardDto) {
        const repository = new repository_1.CardsRepository(new short_uuid_counter_1.ShortUUIDCounter());
        const persistedRepository = new cards_repository_1.CardsRepositoryDynamo(entity_1.CardEntity);
        await persistedRepository.putCard(repository.addCard(createCardDto));
    }
    findAll() {
        return `This action returns all card`;
    }
    findOne(id) {
        return `This action returns a #${id} card`;
    }
    update(id, updateCardDto) {
        return `This action updates a #${id} card: ${updateCardDto}`;
    }
    remove(id) {
        return `This action removes a #${id} card`;
    }
};
exports.CardService = CardService;
exports.CardService = CardService = __decorate([
    (0, common_1.Injectable)()
], CardService);
