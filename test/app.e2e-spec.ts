import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { AppModule } from "../src/app/app.module";
import { AUTHORIZATION_HEADER } from "../src/auth/constants";

const testConfiguration: { [key: string]: string } = {
  USER_STORE_TYPE: "in-memory",
};

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let bearerToken = "";

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it("should tell you that you are not authenticated", () => {
    return supertest(app.getHttpServer())
      .get("/auth/whoami")
      .expect(200)
      .expect({ isAuthenticated: false, username: "" });
  });

  it("should give you an access token on successful sign in", async () => {
    const response = await supertest(app.getHttpServer())
      .post("/auth/signin")
      .send({ login: "testuser1", password: "password1" })
      .expect(200);

    expect(response.body.bearerToken).toMatch(
      /^jwt\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/,
    );
    bearerToken = response.body.bearerToken;
  });

  it("should tell you your username when authenticated", () => {
    return supertest(app.getHttpServer())
      .get("/auth/whoami")
      .set(AUTHORIZATION_HEADER, `Bearer ${bearerToken}`)
      .expect(200)
      .expect({ isAuthenticated: true, username: "testuser1" });
  });
});
