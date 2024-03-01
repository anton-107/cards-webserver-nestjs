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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const common_1 = require("@nestjs/common");
const short_uuid_1 = __importDefault(require("short-uuid"));
const card_dynamodb_1 = require("./entities/card.dynamodb");
const card_entity_1 = require("./entities/card.entity");
let CardService = class CardService {
    constructor(cardDynamoDBTableFactory) {
        this.table = cardDynamoDBTableFactory.build();
    }
    async create(type, createCardDto) {
        const cardID = short_uuid_1.default.generate();
        const card = {
            ...createCardDto,
            type,
            id: cardID,
            cardID: `${type}#${cardID}`,
        };
        card_entity_1.СardEntity.setTable(this.table).put(card);
        return {
            spaceID: card.spaceID,
            id: card.id,
            type: card.type,
            name: card.name,
            parentCardID: card.parentCardID || null,
            attributes: card.attributes,
        };
    }
    async findAllOfType(spaceID, type) {
        try {
            const results = await card_entity_1.СardEntity.setTable(this.table).query(spaceID, {
                beginsWith: `${type}#`,
            });
            return results.Items?.map((x) => this.convertToCard(x));
        }
        catch (error) {
            // Handle or throw the error appropriately
            throw new Error(`Error fetching cards for spaceID ${spaceID}: ${error}`);
        }
    }
    async findAllOfTypeForParent(spaceID, type, parentID) {
        try {
            const results = await card_entity_1.СardEntity.setTable(this.table).query(spaceID, {
                beginsWith: `${type}#`,
                filters: [{ attr: "parentCardID", eq: parentID }],
            });
            return results.Items?.map((x) => this.convertToCard(x));
        }
        catch (error) {
            // Handle or throw the error appropriately
            throw new Error(`Error fetching cards for spaceID ${spaceID}: ${error}`);
        }
    }
    async findOneOfType(spaceID, type, cardID) {
        const result = await card_entity_1.СardEntity.setTable(this.table).get({
            spaceID,
            cardID: `${type}#${cardID}`,
        });
        if (!result.Item) {
            return null;
        }
        const card = result.Item;
        return this.convertToCard(card);
    }
    async update(cardIdentity, updateCardDto) {
        const updatedCard = await card_entity_1.СardEntity.setTable(this.table).update({
            ...updateCardDto,
            spaceID: cardIdentity.spaceID,
            id: cardIdentity.cardID,
            cardID: `${cardIdentity.type}#${cardIdentity.cardID}`,
        }, { returnValues: "ALL_NEW" });
        return updatedCard.Attributes;
    }
    async updateAttributes(cardIdentity, updateCardAttributesDto) {
        const fieldsToUpdate = {};
        Object.keys(updateCardAttributesDto.attributes).forEach((k) => {
            fieldsToUpdate[k] = updateCardAttributesDto.attributes[k];
        });
        const updatedCard = await card_entity_1.СardEntity.setTable(this.table).update({
            spaceID: cardIdentity.spaceID,
            cardID: `${cardIdentity.type}#${cardIdentity.cardID}`,
            attributes: {
                $set: {
                    ...fieldsToUpdate,
                },
            },
        }, { returnValues: "ALL_NEW" });
        return updatedCard.Attributes;
    }
    async remove(spaceID, type, cardID) {
        await card_entity_1.СardEntity
            .setTable(this.table)
            .delete({ spaceID, cardID: `${type}#${cardID}` });
        return { message: "Card deleted successfully." };
    }
    convertToCard(card) {
        return {
            spaceID: card.spaceID,
            id: card.id,
            type: card.type,
            name: card.name,
            parentCardID: card.parentCardID || null,
            attributes: card.attributes,
        };
    }
};
exports.CardService = CardService;
exports.CardService = CardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [card_dynamodb_1.CardDynamoDBTableFactory])
], CardService);
