"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const card_service_1 = require("./card.service");
describe("CardService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [card_service_1.CardService],
        }).compile();
        service = module.get(card_service_1.CardService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
