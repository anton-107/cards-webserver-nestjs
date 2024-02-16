"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ts_mockito_1 = require("ts-mockito");
const cards_controller_1 = require("./cards.controller");
const cards_service_1 = require("./cards.service");
describe("CardsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [cards_controller_1.CardsController],
            providers: [
                {
                    provide: cards_service_1.CardsService,
                    useValue: (0, ts_mockito_1.instance)((0, ts_mockito_1.mock)(cards_service_1.CardsService)),
                },
            ],
        }).compile();
        controller = module.get(cards_controller_1.CardsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
