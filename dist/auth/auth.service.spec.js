"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const authenticator_1 = require("authentication-module/dist/authenticator");
const ts_mockito_1 = require("ts-mockito");
describe("AuthService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: authenticator_1.Authenticator,
                    useValue: (0, ts_mockito_1.instance)((0, ts_mockito_1.mock)(authenticator_1.Authenticator))
                }
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
