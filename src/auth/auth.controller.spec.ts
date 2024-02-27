import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { instance, mock, verify, when } from "ts-mockito";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BearerTokenExtractor } from "./bearer-token-extractor.service";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    // mock auth scenarios:
    const authServiceMock = mock(AuthService);
    when(authServiceMock.signIn("wrong-user-1", "")).thenReject();

    // build module:
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: instance(authServiceMock),
        },
        BearerTokenExtractor,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should return forbidden in json response if authentication fails", async () => {
    const response = mock<Response>();
    const r = await controller.signIn(
      {
        login: "wrong-user-1",
        password: "",
      },
      instance(response),
    );
    verify(response.status(HttpStatus.FORBIDDEN)).called();
    expect(JSON.parse(JSON.stringify(r)).signInResult).toBe(false);
  });
});
