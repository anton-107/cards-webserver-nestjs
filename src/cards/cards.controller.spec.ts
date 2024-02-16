import { Test, TestingModule } from "@nestjs/testing";
import { instance, mock } from "ts-mockito";

import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";

describe("CardsController", () => {
  let controller: CardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: instance(mock(CardsService)),
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
