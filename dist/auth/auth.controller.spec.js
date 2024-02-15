"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const ts_mockito_1 = require("ts-mockito");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
describe("AuthController", () => {
    let controller;
    beforeEach(async () => {
        // mock auth scenarios:
        const authServiceMock = (0, ts_mockito_1.mock)(auth_service_1.AuthService);
        (0, ts_mockito_1.when)(authServiceMock.signIn("wrong-user-1", "")).thenReject();
        // build module:
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                {
                    provide: auth_service_1.AuthService,
                    useValue: (0, ts_mockito_1.instance)(authServiceMock),
                },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
    });
    it("should return forbidden in json response if authentication fails", async () => {
        const response = (0, ts_mockito_1.mock)();
        const r = await controller.signIn({
            login: "wrong-user-1",
            password: "",
        }, (0, ts_mockito_1.instance)(response));
        (0, ts_mockito_1.verify)(response.status(common_1.HttpStatus.FORBIDDEN)).called();
        expect(JSON.parse(JSON.stringify(r)).signInResult).toBe(false);
    });
});
