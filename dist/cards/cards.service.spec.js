"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const cards_service_1 = require("./cards.service");
describe('CardsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [cards_service_1.CardsService],
        }).compile();
        service = module.get(cards_service_1.CardsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
