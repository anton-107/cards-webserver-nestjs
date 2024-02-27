"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const authenticator_1 = require("authentication-module/dist/authenticator");
const ts_mockito_1 = require("ts-mockito");
const bearer_token_extractor_service_1 = require("../auth/bearer-token-extractor.service");
const card_controller_1 = require("./card.controller");
const card_service_1 = require("./card.service");
describe("CardController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [card_controller_1.CardController],
            providers: [
                card_service_1.CardService,
                {
                    provide: authenticator_1.Authenticator,
                    useValue: (0, ts_mockito_1.instance)((0, ts_mockito_1.mock)(authenticator_1.Authenticator)),
                },
                bearer_token_extractor_service_1.BearerTokenExtractor,
            ],
        }).compile();
        controller = module.get(card_controller_1.CardController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
