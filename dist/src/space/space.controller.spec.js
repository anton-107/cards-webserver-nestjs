"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const testing_1 = require("@nestjs/testing");
const authenticator_1 = require("authentication-module/dist/authenticator");
const ts_mockito_1 = require("ts-mockito");
const bearer_token_extractor_service_1 = require("../auth/bearer-token-extractor.service");
const space_dynamodb_1 = require("./entities/space.dynamodb");
const space_controller_1 = require("./space.controller");
const space_service_1 = require("./space.service");
describe("SpaceController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [space_controller_1.SpaceController],
            providers: [
                space_service_1.SpaceService,
                space_dynamodb_1.SpaceDynamoDBTableFactory,
                {
                    provide: authenticator_1.Authenticator,
                    useValue: (0, ts_mockito_1.instance)((0, ts_mockito_1.mock)(authenticator_1.Authenticator)),
                },
                bearer_token_extractor_service_1.BearerTokenExtractor,
            ],
            imports: [config_1.ConfigModule],
        }).compile();
        controller = module.get(space_controller_1.SpaceController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
