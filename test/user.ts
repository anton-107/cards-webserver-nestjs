import supertest from "supertest";
import { App } from "supertest/types";

export class User {
  private bearerToken: string | null = null;
  constructor(
    private login: string,
    private password: string,
  ) {}

  public get authorizationHeader(): string {
    if (!this.bearerToken) {
      throw Error(`User ${this.login} has not signed in`);
    }
    return `Bearer ${this.bearerToken}`;
  }

  public async signIn(appServer: App): Promise<void> {
    const response = await supertest(appServer)
      .post("/auth/signin")
      .send({ login: this.login, password: this.password })
      .expect(200);

    expect(response.body.bearerToken).toMatch(
      /^jwt\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/,
    );
    this.bearerToken = response.body.bearerToken;
  }
}
