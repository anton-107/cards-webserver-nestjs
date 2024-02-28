import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { ChildProcess } from "child_process";
import DynamoDbLocal from "dynamodb-local";
import supertest from "supertest";

import { AppModule } from "../src/app/app.module";
import { AUTHORIZATION_HEADER } from "../src/auth/constants";
import { Space } from "../src/space/entities/space.entity";
import { createLocalSpacesTable, startDynamoLocal } from "./dynamodb-local";

const testConfiguration: { [key: string]: string } = {
  USER_STORE_TYPE: "in-memory",
  DYNAMOCLIENT_ENDPOINT_OVERRIDE: "http://127.0.0.1:8937",
  DYNAMODB_SPACE_TABLENAME: "TestTableForSpaces",
};

describe("Spaces feature (e2e)", () => {
  let app: INestApplication;
  let bearerToken = "";
  let dynamoProcessToStop: ChildProcess;

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
    await app.init();
  }, 10_000);

  afterAll(async () => {
    if (dynamoProcessToStop) {
      await DynamoDbLocal.stopChild(dynamoProcessToStop);
    }
    if (app) {
      await app.close();
    }
  });

  it("should not allow you to create a new space if you are not signed in", () => {
    return supertest(app.getHttpServer())
      .post("/space")
      .send({ spaceID: "test-space-1" })
      .expect(403)
      .expect({
        message: "Forbidden resource",
        error: "Forbidden",
        statusCode: 403,
      });
  });

  it("should give you an access token on successful sign in", async () => {
    const response = await supertest(app.getHttpServer())
      .post("/auth/signin")
      .send({ login: "testuser1", password: "password-1" })
      .expect(200);

    expect(response.body.bearerToken).toMatch(
      /^jwt\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/,
    );
    bearerToken = response.body.bearerToken;
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
      await supertest(app.getHttpServer())
        .post("/space")
        .send({ spaceID })
        .set(AUTHORIZATION_HEADER, `Bearer ${bearerToken}`)
        .expect(400);
    }
  });

  it("should allow you to create a new space", () => {
    return supertest(app.getHttpServer())
      .post("/space")
      .send({ spaceID: "test-space-1" })
      .set(AUTHORIZATION_HEADER, `Bearer ${bearerToken}`)
      .expect(201)
      .expect({
        spaceID: "test-space-1",
        sortKey: "SPACE",
        owner: "testuser1",
      });
  });

  it("should list the space you created", async () => {
    const resp = await supertest(app.getHttpServer())
      .get("/space")
      .set(AUTHORIZATION_HEADER, `Bearer ${bearerToken}`)
      .expect(200);

    const spaces: Space[] = resp.body.spaces;
    expect(spaces.length).toBe(1);
    expect(spaces[0].owner).toBe("testuser1");
    expect(spaces[0].spaceID).toBe("test-space-1");
  });
});
