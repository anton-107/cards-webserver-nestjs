import { Injectable } from "@nestjs/common";
import { CardsRepositoryDynamo } from "cards-datalayer-dynamodb/dist/cards-repository";
import { CardEntity } from "cards-datalayer-dynamodb/dist/dynamodb-toolbox/entity";
import { ShortUUIDCounter } from "cards-datalayer-dynamodb/dist/short-uuid-counter";
import { CardsRepository } from "cards-model/dist/repository";

import { NewCardRequestDTO } from "./cards.dto";

@Injectable()
export class CardsService {
  async createCard(card: NewCardRequestDTO) {
    const repository = new CardsRepository(new ShortUUIDCounter());
    const persistedRepository = new CardsRepositoryDynamo(CardEntity);
    await persistedRepository.putCard(repository.addCard(card));
  }
}
