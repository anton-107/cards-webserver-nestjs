import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Authenticator } from "authentication-module/dist/authenticator";
import { instance, mock } from "ts-mockito";

import { BearerTokenExtractor } from "../auth/bearer-token-extractor.service";
import { SpaceModule } from "../space/space.module";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { CardDynamoDBTableFactory } from "./entities/card.dynamodb";

describe("CardController", () => {
  let controller: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        CardService,
        CardDynamoDBTableFactory,
        {
          provide: Authenticator,
          useValue: instance(mock(Authenticator)),
        },
        BearerTokenExtractor,
      ],
      imports: [ConfigModule, SpaceModule],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
