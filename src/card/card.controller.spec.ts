import { Test, TestingModule } from "@nestjs/testing";
import { Authenticator } from "authentication-module/dist/authenticator";
import { instance, mock } from "ts-mockito";

import { BearerTokenExtractor } from "../auth/bearer-token-extractor.service";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";

describe("CardController", () => {
  let controller: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        CardService,
        {
          provide: Authenticator,
          useValue: instance(mock(Authenticator)),
        },
        BearerTokenExtractor,
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
