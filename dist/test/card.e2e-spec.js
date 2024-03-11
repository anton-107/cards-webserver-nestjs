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
const space_1 = require("./test-entities/space");
const user_1 = require("./test-entities/user");
const testConfiguration = {
    USER_STORE_TYPE: "in-memory",
    DYNAMOCLIENT_ENDPOINT_OVERRIDE: "http://127.0.0.1:8931",
    DYNAMODB_SPACE_TABLENAME: "TestTableForSpaces",
    DYNAMODB_CARD_TABLENAME: "TestTableForCards",
};
describe("Spaces feature (e2e)", () => {
    let app;
    let dynamoProcessToStop;
    const userA = new user_1.User("testuser1", "password1");
    const userB = new user_1.User("testuser2", "password2");
    const spaceA = new space_1.TestSpace("space-A", userA);
    beforeAll(async () => {
        // start local dynamodb:
        const port = testConfiguration["DYNAMOCLIENT_ENDPOINT_OVERRIDE"].split(":")[2];
        const { ddbClient, dynamoLocalProcess } = await (0, dynamodb_local_2.startDynamoLocal)(parseInt(port));
        dynamoProcessToStop = dynamoLocalProcess;
        await (0, dynamodb_local_2.createLocalSpacesTable)(ddbClient, testConfiguration["DYNAMODB_SPACE_TABLENAME"]);
        await (0, dynamodb_local_2.createLocalCardsTable)(ddbClient, testConfiguration["DYNAMODB_CARD_TABLENAME"]);
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
        if (process.env.SHOW_APP_LOGS) {
            app.useLogger(console);
        }
        await app.init();
        const server = app.getHttpServer();
        // sign in users:
        await userA.signIn(server);
        await userB.signIn(server);
        // create spaces:
        await spaceA.create(server);
    }, 20_000);
    afterAll(async () => {
        if (dynamoProcessToStop) {
            await dynamodb_local_1.default.stopChild(dynamoProcessToStop);
        }
        if (app) {
            await app.close();
        }
    });
    it("should not allow you to create a card if you are not signed in", () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .post("/card/todo-item")
            .send({ spaceID: spaceA.spaceID })
            .expect(403)
            .expect({
            message: "Forbidden resource",
            error: "Forbidden",
            statusCode: 403,
        });
    });
    it("should not allow invalid card type", async () => {
        const invalidCardTypeExamples = [
            " card1",
            "card1 ",
            "card1 1",
            "-card1",
            "card-1-",
        ];
        for (const i in invalidCardTypeExamples) {
            const type = invalidCardTypeExamples[i];
            await (0, supertest_1.default)(app.getHttpServer())
                .post(`/card/${type}`)
                .send({ spaceID: spaceA.spaceID })
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(400);
        }
    });
    it("should allow userA to create a card in their space", async () => {
        const resp = await (0, supertest_1.default)(app.getHttpServer())
            .post("/card/todo-item")
            .send({
            spaceID: spaceA.spaceID,
            name: "To Do Item 1",
            attributes: { checked: false },
        })
            .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
            .expect(201);
        const card = resp.body;
        expect(card.spaceID).toBe(spaceA.spaceID);
        expect(card.type).toBe("todo-item");
        expect(card.parentCardID).toBeNull();
        expect(card.id).toMatch(/[A-z0-9]{22}/);
        expect(card.attributes["checked"]).toBe(false);
    });
    it("should not allow userB to create a card in userA space", async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .post("/card/todo-item")
            .send({
            spaceID: spaceA.spaceID,
            name: "To Do Item 9000",
            attributes: { checked: false },
        })
            .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
            .expect(403);
    });
    it("should allow userA to create another card in their space", async () => {
        const resp = await (0, supertest_1.default)(app.getHttpServer())
            .post("/card/todo-item")
            .send({
            spaceID: spaceA.spaceID,
            name: "To Do Item 2",
            attributes: { checked: true },
        })
            .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
            .expect(201);
        const card = resp.body;
        expect(card.spaceID).toBe(spaceA.spaceID);
        expect(card.type).toBe("todo-item");
        expect(card.parentCardID).toBeNull();
        expect(card.id).toMatch(/[A-z0-9]{22}/);
        expect(card.attributes["checked"]).toBe(true);
    });
    it("should allow userA to list cards in their space", async () => {
        const resp = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/card/list/${spaceA.spaceID}/todo-item`)
            .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
            .expect(200);
        const cards = resp.body;
        expect(cards.length).toBe(2);
        expect(cards[0].spaceID).toBe(spaceA.spaceID);
        expect(cards[1].spaceID).toBe(spaceA.spaceID);
    });
    it("should not allow userB to list cards in userA space", async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .get(`/card/list/${spaceA.spaceID}/todo-item`)
            .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
            .expect(403)
            .expect({
            message: "Forbidden resource",
            error: "Forbidden",
            statusCode: 403,
        });
    });
    describe("Child-parent card relationships and fetching individual cards", () => {
        let parentCardID = "";
        it("should allow userA to create cards that are children of another card in their space", async () => {
            const resp = await (0, supertest_1.default)(app.getHttpServer())
                .post("/card/project")
                .send({
                spaceID: spaceA.spaceID,
                name: "Project 1",
                attributes: {
                    startDate: "2024-03-01",
                    estimatedDeliveryDate: "2024-03-31",
                },
            })
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(201);
            const card = resp.body;
            parentCardID = card.id;
            await (0, supertest_1.default)(app.getHttpServer())
                .post("/card/task")
                .send({
                spaceID: spaceA.spaceID,
                name: "Task 1",
                parentCardID,
                attributes: { isComplete: false },
            })
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .post("/card/task")
                .send({
                spaceID: spaceA.spaceID,
                name: "Task 2",
                parentCardID,
                attributes: { isComplete: false },
            })
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(201);
        });
        it("should allow userA to list children cards of a parent card", async () => {
            const resp = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/card/list/${spaceA.spaceID}/task/children-of/${parentCardID}`)
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(200);
            const cards = resp.body;
            expect(cards.length).toBe(2);
            expect(cards[0].spaceID).toBe(spaceA.spaceID);
            expect(cards[0].parentCardID).toBe(parentCardID);
            expect(cards[1].spaceID).toBe(spaceA.spaceID);
            expect(cards[1].parentCardID).toBe(parentCardID);
        });
        it("should not allow userB to list children cards of a parent card", async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .get(`/card/list/${spaceA.spaceID}/task/children-of/${parentCardID}`)
                .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
                .expect(403);
        });
        it("should allow userA to get one card in their space", async () => {
            const resp = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/card/${spaceA.spaceID}/project/${parentCardID}`)
                .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                .expect(200);
            const card = resp.body;
            expect(card.name).toBe("Project 1");
            expect(card.attributes.startDate).toBe("2024-03-01");
        });
        it("should not allow userB to get one card in userA space", async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .get(`/card/${spaceA.spaceID}/project/${parentCardID}`)
                .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
                .expect(403);
        });
        describe("Updating a card", () => {
            it("should allow userA to update a card in their space", async () => {
                const readResp = await (0, supertest_1.default)(app.getHttpServer())
                    .get(`/card/${spaceA.spaceID}/project/${parentCardID}`)
                    .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                    .expect(200);
                const card = readResp.body;
                card.name = "Project One";
                const updateResp = await (0, supertest_1.default)(app.getHttpServer())
                    .patch(`/card/project/${parentCardID}`)
                    .send(card)
                    .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                    .expect(200);
                const updatedCard = updateResp.body;
                expect(updatedCard.name).toBe("Project One");
                expect(updatedCard.attributes.startDate).toBe("2024-03-01");
            });
            it("should not allow userB to update a card in userA space", async () => {
                const readResp = await (0, supertest_1.default)(app.getHttpServer())
                    .get(`/card/${spaceA.spaceID}/project/${parentCardID}`)
                    .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                    .expect(200);
                const card = readResp.body;
                card.name = "Project belongs to user B now";
                await (0, supertest_1.default)(app.getHttpServer())
                    .patch(`/card/project/${parentCardID}`)
                    .send(card)
                    .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
                    .expect(403);
            });
        });
        describe("Updating card attributes", () => {
            it("should allow userA to update attributes of a card in their space", async () => {
                const updateResp = await (0, supertest_1.default)(app.getHttpServer())
                    .patch(`/card/project/${parentCardID}`)
                    .send({
                    spaceID: spaceA.spaceID,
                    attributes: {
                        estimatedDeliveryDate: "2024-04-30",
                    },
                })
                    .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                    .expect(200);
                const updatedCard = updateResp.body;
                // expect(updatedCard.attributes.startDate).toBe("2024-03-01");
                expect(updatedCard.attributes.estimatedDeliveryDate).toBe("2024-04-30");
            });
            it("should not allow userB to update attributes of a card in userA space", async () => {
                await (0, supertest_1.default)(app.getHttpServer())
                    .patch(`/card/project/${parentCardID}`)
                    .send({
                    spaceID: spaceA.spaceID,
                    attributes: {
                        estimatedDeliveryDate: "2024-04-30",
                    },
                })
                    .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
                    .expect(403);
            });
        });
        describe("Removing a card", () => {
            it("should not allow userB to remove a card in userA space", async () => {
                await (0, supertest_1.default)(app.getHttpServer())
                    .delete(`/card/${spaceA.spaceID}/project/${parentCardID}`)
                    .set(constants_1.AUTHORIZATION_HEADER, userB.authorizationHeader)
                    .expect(403);
            });
            it("should allow userA to remove a card in their space", async () => {
                await (0, supertest_1.default)(app.getHttpServer())
                    .delete(`/card/${spaceA.spaceID}/project/${parentCardID}`)
                    .set(constants_1.AUTHORIZATION_HEADER, userA.authorizationHeader)
                    .expect(200);
            });
        });
    });
});
