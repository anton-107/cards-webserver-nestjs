import { Body, Controller, Post } from "@nestjs/common";

import { NewCardRequestHttpBody } from "./cards.dto";
import { CardsService } from "./cards.service";

@Controller("cards")
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post("/")
  public async createCard(@Body() request: NewCardRequestHttpBody) {
    return await this.cardsService.createCard(request);
  }
}
