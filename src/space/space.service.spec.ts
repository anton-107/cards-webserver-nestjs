import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { SpaceService } from "./space.service";

describe("SpaceService", () => {
  let service: SpaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceService, SpaceDynamoDBTableFactory],
      imports: [ConfigModule],
    }).compile();

    service = module.get<SpaceService>(SpaceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
