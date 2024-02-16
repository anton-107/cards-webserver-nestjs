import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommandOutput,
  UpdateCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { Injectable } from "@nestjs/common";
import { Entity, Table } from "dynamodb-toolbox";
import shortUUID from "short-uuid";

import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { Card } from "./entities/card.entity";

@Injectable()
export class CardService {
  private documentClient: DynamoDBDocumentClient;
  private cardEntity: Entity;

  constructor() {
    // set up dynamodb toolbox:
    const marshallOptions = {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false, // if not false explicitly, we set it to true.
      // Whether to remove undefined values while marshalling.
      removeUndefinedValues: false, // false, by default.
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: false, // false, by default.
    };

    const unmarshallOptions = {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      // NOTE: this is required to be true in order to use the bigint data type.
      wrapNumbers: false, // false, by default.
    };

    const translateConfig = { marshallOptions, unmarshallOptions };
    // DynamoDB DocumentClient
    this.documentClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({}),
      translateConfig,
    );

    // Define the DynamoDB Table
    const CardsTable = new Table({
      name: process.env["DYNAMODB_CARD_TABLENAME"] || "CardTable",
      partitionKey: "spaceID",
      sortKey: "cardID",
      DocumentClient: this.documentClient,
    });

    // Define the Card Entity
    this.cardEntity = new Entity({
      name: "Card",
      attributes: {
        spaceID: { partitionKey: true },
        cardID: { sortKey: true },
        name: "string",
        parentTaskID: { type: "string", required: false }, // Nullable
        attributes: { type: "map" },
        // Add subtype-specific attributes here or handle dynamically in application logic
      },
      table: CardsTable,
    } as const);
  }

  async create(createCardDto: CreateCardDto) {
    const cardID = shortUUID.generate();
    const card = {
      ...createCardDto,
      cardID,
    };
    await this.cardEntity.put(card);
    return card;
  }

  async findAll(spaceID: string) {
    try {
      const results = await this.cardEntity.query(spaceID);
      return results.Items;
    } catch (error) {
      // Handle or throw the error appropriately
      throw new Error(`Error fetching cards for spaceID ${spaceID}: ${error}`);
    }
  }

  async findOne(spaceID: string, cardID: string): Promise<Card | null> {
    const result = (await this.cardEntity.get({
      spaceID,
      cardID,
    })) as unknown as GetCommandOutput;
    return result.Item || null;
  }

  async update(spaceID: string, cardID: string, updateCardDto: UpdateCardDto) {
    const updatedCard = (await this.cardEntity.update(
      {
        ...updateCardDto,
        spaceID,
        cardID,
      },
      { returnValues: "ALL_NEW" },
    )) as unknown as UpdateCommandOutput;
    return updatedCard.Attributes;
  }

  async remove(spaceID: string, cardID: string) {
    await this.cardEntity.delete({ spaceID, cardID });
    return { message: "Card deleted successfully." };
  }
}
