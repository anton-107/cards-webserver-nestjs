"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app/app.module");
const constants_1 = require("../src/auth/constants");
const testConfiguration = {
    USER_STORE_TYPE: "in-memory",
};
describe("AppController (e2e)", () => {
    let app;
    let bearerToken = "";
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(config_1.ConfigService)
            .useValue({
            get: (key) => {
                return testConfiguration[key];
            },
        })
            .compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it("should tell you that you are not authenticated", () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get("/auth/whoami")
            .expect(200)
            .expect({ isAuthenticated: false, username: "" });
    });
    it("should give you an access token on successful sign in", async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post("/auth/signin")
            .send({ login: "testuser1", password: "password1" })
            .expect(200);
        expect(response.body.bearerToken).toMatch(/^jwt\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/);
        bearerToken = response.body.bearerToken;
    });
    it("should tell you your username when authenticated", () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get("/auth/whoami")
            .set(constants_1.AUTHORIZATION_HEADER, `Bearer ${bearerToken}`)
            .expect(200)
            .expect({ isAuthenticated: true, username: "testuser1" });
    });
});
