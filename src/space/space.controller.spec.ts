import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Authenticator } from "authentication-module/dist/authenticator";
import { instance, mock } from "ts-mockito";

import { BearerTokenExtractor } from "../auth/bearer-token-extractor.service";
import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { SpaceController } from "./space.controller";
import { SpaceService } from "./space.service";

describe("SpaceController", () => {
  let controller: SpaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceController],
      providers: [
        SpaceService,
        SpaceDynamoDBTableFactory,
        {
          provide: Authenticator,
          useValue: instance(mock(Authenticator)),
        },
        BearerTokenExtractor,
      ],
      imports: [ConfigModule],
    }).compile();

    controller = module.get<SpaceController>(SpaceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
