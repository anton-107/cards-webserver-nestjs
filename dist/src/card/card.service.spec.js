"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const testing_1 = require("@nestjs/testing");
const card_service_1 = require("./card.service");
const card_dynamodb_1 = require("./entities/card.dynamodb");
describe("CardService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [card_service_1.CardService, card_dynamodb_1.CardDynamoDBTableFactory],
            imports: [config_1.ConfigModule],
        }).compile();
        service = module.get(card_service_1.CardService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
