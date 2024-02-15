"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const cards_controller_1 = require("./cards.controller");
describe('CardsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [cards_controller_1.CardsController],
        }).compile();
        controller = module.get(cards_controller_1.CardsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
