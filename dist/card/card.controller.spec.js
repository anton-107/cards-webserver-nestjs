"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const card_controller_1 = require("./card.controller");
const card_service_1 = require("./card.service");
describe("CardController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [card_controller_1.CardController],
            providers: [card_service_1.CardService],
        }).compile();
        controller = module.get(card_controller_1.CardController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
