import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { AppModule } from "../src/app/app.module";
import { AUTH_TOKEN_EXPIRATION_HOURS } from "../src/auth/authenticator.provider";
import { AUTHORIZATION_HEADER } from "../src/auth/constants";
import { USER_STORE_TYPE } from "../src/auth/user.repository";

const testConfiguration: { [key: string]: string | number } = {
  [USER_STORE_TYPE]: "in-memory",
  [AUTH_TOKEN_EXPIRATION_HOURS]: 0.5,
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
        get: (key: string): string | number => {
          return testConfiguration[key];
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    if (process.env.SHOW_APP_LOGS) {
      app.useLogger(console);
    }
    await app.init();
  });

  afterAll(async () => {
    app.flushLogs();
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
