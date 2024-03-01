"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const testing_1 = require("@nestjs/testing");
const dynamodb_local_1 = __importDefault(require("dynamodb-local"));
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app/app.module");
const constants_1 = require("../src/auth/constants");
const dynamodb_local_2 = require("./dynamodb-local");
const user_1 = require("./test-entities/user");
const testConfiguration = {
    USER_STORE_TYPE: "in-memory",
    DYNAMOCLIENT_ENDPOINT_OVERRIDE: "http://127.0.0.1:8937",
    DYNAMODB_SPACE_TABLENAME: "TestTableForSpaces",
};
describe("Spaces feature (e2e)", () => {
    let app;
    let dynamoProcessToStop;
    const userA = new user_1.User("testuser1", "password1");
    const userB = new user_1.User("testuser2", "password2");
    beforeAll(async () => {
        // start local dynamodb:
        const port = testConfiguration["DYNAMOCLIENT_ENDPOINT_OVERRIDE"].split(":")[2];
        const { ddbClient, dynamoLocalProcess } = await (0, dynamodb_local_2.startDynamoLocal)(parseInt(port));
        dynamoProcessToStop = dynamoLocalProcess;
        await (0, dynamodb_local_2.createLocalSpacesTable)(ddbClient, testConfiguration["DYNAMODB_SPACE_TABLENAME"]);
        // start nest.js application:
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
        const server = app.getHttpServer();
        // sign in users:
        await userA.signIn(server);
        await userB.signIn(server);
    }, 20000);
    afterAll(async () => {
        if (dynamoProcessToStop) {
            await dynamodb_local_1.default.stopChild(dynamoProcessToStop);
        }
        if (app) {
            await app.close();
        }
    });
    it("should not allow you to create a new space if you are not signed in", () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post("/space")
            .send({ spaceID: "test-space-1" })
            .expect(403)
            .expect({
            message: "Forbidden resource",
            error: "Forbidden",
            statusCode: 403,
        });
    });
    it("should not allow invalid space id", async () => {
        const invalidSpaceIDExamples = [
            " space1",
            "space1 ",
            "space 1",
            "-space1",
            "space-1-",
        ];
        for (const i in invalidSpaceIDExamples) {
            const spaceID = invalidSpaceIDExamples[i];
            await (0, supertest_1.default)(app.getHttpServer())
                .post("/space")
                .send({ spaceID })
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(400);
        }
    });
    it("should allow userA to create a new space", async () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post("/space")
            .send({ spaceID: "test-space-1" })
            .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
            .expect(201)
            .expect({
            spaceID: "test-space-1",
            sortKey: "SPACE",
            owner: "testuser1",
        });
    });
    it("should allow userB to create a new space", async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .post("/space")
            .send({ spaceID: "test-space-2" })
            .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
            .expect(201)
            .expect({
            spaceID: "test-space-2",
            sortKey: "SPACE",
            owner: "testuser2",
        });
        await (0, supertest_1.default)(app.getHttpServer())
            .post("/space")
            .send({ spaceID: "test-space-3" })
            .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
            .expect(201)
            .expect({
            spaceID: "test-space-3",
            sortKey: "SPACE",
            owner: "testuser2",
        });
    });
    it("should list the space userA created", async () => {
        const resp = await (0, supertest_1.default)(app.getHttpServer())
            .get("/space")
            .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
            .expect(200);
        const spaces = resp.body.spaces;
        expect(spaces.length).toBe(1);
        expect(spaces[0].owner).toBe("testuser1");
        expect(spaces[0].spaceID).toBe("test-space-1");
    });
    it("should list the spaces userB created", async () => {
        const resp = await (0, supertest_1.default)(app.getHttpServer())
            .get("/space")
            .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
            .expect(200);
        const spaces = resp.body.spaces;
        expect(spaces.length).toBe(2);
        expect(spaces[0].owner).toBe("testuser2");
        expect(spaces[1].owner).toBe("testuser2");
    });
});
