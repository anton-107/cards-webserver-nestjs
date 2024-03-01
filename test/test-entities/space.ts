import supertest from "supertest";
import { App } from "supertest/types";

import { AUTHORIZATION_HEADER } from "../../src/auth/constants";
import { User } from "./user";

export class TestSpace {
  constructor(
    public readonly spaceID: string,
    public readonly owner: User,
  ) {}

  public async create(appServer: App) {
    return supertest(appServer)
      .post("/space")
      .send({ spaceID: this.spaceID })
      .set(AUTHORIZATION_HEADER, this.owner.authorizationHeader)
      .expect(201)
      .expect({
        spaceID: this.spaceID,
        sortKey: "SPACE",
        owner: this.owner.login,
      });
  }
}
