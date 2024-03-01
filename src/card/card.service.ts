import { Injectable } from "@nestjs/common";
import shortUUID from "short-uuid";

import { CardIdentity } from "./dto/card-identity.dto";
import { CardAttributeValue, CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { UpdateCardAttributesDto } from "./dto/update-card-attributes.dto";
import { CardDynamoDBTableFactory } from "./entities/card.dynamodb";
import { Card, СardEntity } from "./entities/card.entity";

@Injectable()
export class CardService {
  private table;
  constructor(cardDynamoDBTableFactory: CardDynamoDBTableFactory) {
    this.table = cardDynamoDBTableFactory.build();
  }

  async create(type: string, createCardDto: CreateCardDto): Promise<Card> {
    const cardID = shortUUID.generate();
    const card = {
      ...createCardDto,
      type,
      id: cardID,
      cardID: `${type}#${cardID}`,
    };
    СardEntity.setTable(this.table).put(card);
    return {
      spaceID: card.spaceID,
      id: card.id,
      type: card.type,
      name: card.name,
      parentCardID: card.parentCardID || null,
      attributes: card.attributes,
    };
  }

  async findAllOfType(spaceID: string, type: string) {
    try {
      const results = await СardEntity.setTable(this.table).query(spaceID, {
        beginsWith: `${type}#`,
      });
      return results.Items?.map((x) => this.convertToCard(x as Card));
    } catch (error) {
      // Handle or throw the error appropriately
      throw new Error(`Error fetching cards for spaceID ${spaceID}: ${error}`);
    }
  }

  async findAllOfTypeForParent(
    spaceID: string,
    type: string,
    parentID: string,
  ) {
    try {
      const results = await СardEntity.setTable(this.table).query(spaceID, {
        beginsWith: `${type}#`,
        filters: [{ attr: "parentCardID", eq: parentID }],
      });
      return results.Items?.map((x) => this.convertToCard(x as Card));
    } catch (error) {
      // Handle or throw the error appropriately
      throw new Error(`Error fetching cards for spaceID ${spaceID}: ${error}`);
    }
  }

  async findOneOfType(
    spaceID: string,
    type: string,
    cardID: string,
  ): Promise<Card | null> {
    const result = await СardEntity.setTable(this.table).get({
      spaceID,
      cardID: `${type}#${cardID}`,
    });
    if (!result.Item) {
      return null;
    }
    const card = result.Item;
    return this.convertToCard(card as Card);
  }

  async update(cardIdentity: CardIdentity, updateCardDto: UpdateCardDto) {
    const updatedCard = await СardEntity.setTable(this.table).update(
      {
        ...updateCardDto,
        spaceID: cardIdentity.spaceID,
        id: cardIdentity.cardID,
        cardID: `${cardIdentity.type}#${cardIdentity.cardID}`,
      },
      { returnValues: "ALL_NEW" },
    );
    return updatedCard.Attributes;
  }

  async updateAttributes(
    cardIdentity: CardIdentity,
    updateCardAttributesDto: UpdateCardAttributesDto,
  ) {
    const fieldsToUpdate: { [key: string]: CardAttributeValue } = {};
    Object.keys(updateCardAttributesDto.attributes).forEach((k) => {
      fieldsToUpdate[k] = updateCardAttributesDto.attributes[k];
    });
    const updatedCard = await СardEntity.setTable(this.table).update(
      {
        spaceID: cardIdentity.spaceID,
        cardID: `${cardIdentity.type}#${cardIdentity.cardID}`,
        attributes: {
          $set: {
            ...fieldsToUpdate,
          },
        },
      },
      { returnValues: "ALL_NEW" },
    );
    return updatedCard.Attributes;
  }

  async remove(spaceID: string, type: string, cardID: string) {
    await СardEntity
      .setTable(this.table)
      .delete({ spaceID, cardID: `${type}#${cardID}` });
    return { message: "Card deleted successfully." };
  }

  private convertToCard(card: Card): Card {
    return {
      spaceID: card.spaceID,
      id: card.id,
      type: card.type,
      name: card.name,
      parentCardID: card.parentCardID || null,
      attributes: card.attributes,
    };
  }
}
