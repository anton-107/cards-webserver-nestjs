import { Injectable } from "@nestjs/common";
import { CardsRepositoryDynamo } from "cards-datalayer-dynamodb/dist/cards-repository";
import { CardEntity } from "cards-datalayer-dynamodb/dist/dynamodb-toolbox/entity";
import { ShortUUIDCounter } from "cards-datalayer-dynamodb/dist/short-uuid-counter";
import { CardsRepository } from "cards-model/dist/repository";

import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Injectable()
export class CardService {
  async create(createCardDto: CreateCardDto) {
    const repository = new CardsRepository(new ShortUUIDCounter());
    const persistedRepository = new CardsRepositoryDynamo(CardEntity);
    await persistedRepository.putCard(repository.addCard(createCardDto));
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card: ${updateCardDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
