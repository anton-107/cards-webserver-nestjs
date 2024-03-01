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
import { User } from "./test-entities/user";

const testConfiguration: { [key: string]: string } = {
  USER_STORE_TYPE: "in-memory",
  DYNAMOCLIENT_ENDPOINT_OVERRIDE: "http://127.0.0.1:8930",
  DYNAMODB_SPACE_TABLENAME: "TestTableForSpaces",
};

describe("Spaces feature (e2e)", () => {
  let app: INestApplication;
  let dynamoProcessToStop: ChildProcess;

  const userA = new User("testuser1", "password1");
  const userB = new User("testuser2", "password2");

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
    const server = app.getHttpServer();

    // sign in users:
    await userA.signIn(server);
    await userB.signIn(server);
  }, 20_000);

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
        .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
        .expect(400);
    }
  });

  it("should allow userA to create a new space", async () => {
    return supertest(app.getHttpServer())
      .post("/space")
      .send({ spaceID: "test-space-1" })
      .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
      .expect(201)
      .expect({
        spaceID: "test-space-1",
        sortKey: "SPACE",
        owner: "testuser1",
      });
  });

  it("should allow userB to create a new space", async () => {
    await supertest(app.getHttpServer())
      .post("/space")
      .send({ spaceID: "test-space-2" })
      .set(AUTHORIZATION_HEADER, userB.authorizationHeader)
      .expect(201)
      .expect({
        spaceID: "test-space-2",
        sortKey: "SPACE",
        owner: "testuser2",
      });
    await supertest(app.getHttpServer())
      .post("/space")
      .send({ spaceID: "test-space-3" })
      .set(AUTHORIZATION_HEADER, userB.authorizationHeader)
      .expect(201)
      .expect({
        spaceID: "test-space-3",
        sortKey: "SPACE",
        owner: "testuser2",
      });
  });

  it("should list the space userA created", async () => {
    const resp = await supertest(app.getHttpServer())
      .get("/space")
      .set(AUTHORIZATION_HEADER, userA.authorizationHeader)
      .expect(200);

    const spaces: Space[] = resp.body.spaces;
    expect(spaces.length).toBe(1);
    expect(spaces[0].owner).toBe("testuser1");
    expect(spaces[0].spaceID).toBe("test-space-1");
  });

  it("should list the spaces userB created", async () => {
    const resp = await supertest(app.getHttpServer())
      .get("/space")
      .set(AUTHORIZATION_HEADER, userB.authorizationHeader)
      .expect(200);

    const spaces: Space[] = resp.body.spaces;
    expect(spaces.length).toBe(2);
    expect(spaces[0].owner).toBe("testuser2");
    expect(spaces[1].owner).toBe("testuser2");
  });
});
