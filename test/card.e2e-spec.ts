import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { ChildProcess } from "child_process";
import DynamoDbLocal from "dynamodb-local";
import supertest from "supertest";

import { AppModule } from "../src/app/app.module";
import { AUTHORIZATION_HEADER } from "../src/auth/constants";
import { Card } from "../src/card/entities/card.entity";
import {
  createLocalCardsTable,
  createLocalSpacesTable,
  startDynamoLocal,
} from "./dynamodb-local";
import { TestSpace } from "./test-entities/space";
import { User } from "./test-entities/user";

const testConfiguration: { [key: string]: string } = {
  USER_STORE_TYPE: "in-memory",
  DYNAMOCLIENT_ENDPOINT_OVERRIDE: "http://127.0.0.1:8931",
  DYNAMODB_SPACE_TABLENAME: "TestTableForSpaces",
  DYNAMODB_CARD_TABLENAME: "TestTableForCards",
};

describe("Spaces feature (e2e)", () => {
  let app: INestApplication;
  let dynamoProcessToStop: ChildProcess;

  const userA = new User("testuser1", "password1");
  const userB = new User("testuser2", "password2");

  const spaceA = new TestSpace("space-A", userA);

  beforeAll(async () => {
    // start local dynamodb:
    const port =
      testConfiguration["DYNAMOCLIENT_ENDPOINT_OVERRIDE"].split(":")[2];
    const { ddbClient, dynamoLocalProcess } = await startDynamoLocal(
      parseInt(port),
    );
    dynamoProcessToStop = dynamoLocalProcess;
    await createLocalSpacesTable(
      ddbClient,
      testConfiguration["DYNAMODB_SPACE_TABLENAME"],
    );
    await createLocalCardsTable(
      ddbClient,
      testConfiguration["DYNAMODB_CARD_TABLENAME"],
    );

    // start nest.js application:
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string): string => {
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
      await DynamoDbLocal.stopChild(dynamoProcessToStop);
    }
    if (app) {
      await app.close();
    }
  });

  it("should not allow you to create a card if you are not signed in", () => {
    return supertest(app.getHttpServer())
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
      await supertest(app.getHttpServer())
        .post(`/card/${type}`)
        .send({ spaceID: spaceA.spaceID })
        .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
        .expect(400);
    }
  });

  it("should allow userA to create a card in their space", async () => {
    const resp = await supertest(app.getHttpServer())
      .post("/card/todo-item")
      .send({
        spaceID: spaceA.spaceID,
        name: "To Do Item 1",
        attributes: { checked: false },
      })
      .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
      .expect(201);

    const card: Card = resp.body;

    expect(card.spaceID).toBe(spaceA.spaceID);
    expect(card.type).toBe("todo-item");
    expect(card.parentCardID).toBeNull();
    expect(card.id).toMatch(/[A-z0-9]{22}/);
    expect(card.attributes["checked"]).toBe(false);
  });

  it("should allow userA to create another card in their space", async () => {
    const resp = await supertest(app.getHttpServer())
      .post("/card/todo-item")
      .send({
        spaceID: spaceA.spaceID,
        name: "To Do Item 2",
        attributes: { checked: true },
      })
      .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
      .expect(201);

    const card: Card = resp.body;

    expect(card.spaceID).toBe(spaceA.spaceID);
    expect(card.type).toBe("todo-item");
    expect(card.parentCardID).toBeNull();
    expect(card.id).toMatch(/[A-z0-9]{22}/);
    expect(card.attributes["checked"]).toBe(true);
  });

  it("should allow userA to list cards in their space", async () => {
    const resp = await supertest(app.getHttpServer())
      .get(`/card/list/${spaceA.spaceID}/todo-item`)
      .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
      .expect(200);

    const cards: Card[] = resp.body;

    expect(cards.length).toBe(2);
    expect(cards[0].spaceID).toBe(spaceA.spaceID);
    expect(cards[1].spaceID).toBe(spaceA.spaceID);
  });

  it("should not allow userB to list cards in userA space", async () => {
    await supertest(app.getHttpServer())
      .get(`/card/list/${spaceA.spaceID}/todo-item`)
      .set(AUTHORIZATION_HEADER, userB.authorizationHeader)
      .expect(403)
      .expect({
        message: "Forbidden resource",
        error: "Forbidden",
        statusCode: 403,
      });
  });
});
