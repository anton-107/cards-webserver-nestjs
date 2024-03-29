import { Test, TestingModule } from "@nestjs/testing";
import { Authenticator } from "authentication-module/dist/authenticator";
import { instance, mock } from "ts-mockito";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: Authenticator,
          useValue: instance(mock(Authenticator)),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
