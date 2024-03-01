import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { CardService } from "./card.service";
import { CardDynamoDBTableFactory } from "./entities/card.dynamodb";

describe("CardService", () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService, CardDynamoDBTableFactory],
      imports: [ConfigModule],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
