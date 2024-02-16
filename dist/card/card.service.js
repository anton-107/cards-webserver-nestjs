"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const common_1 = require("@nestjs/common");
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
const short_uuid_1 = __importDefault(require("short-uuid"));
let CardService = class CardService {
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
        this.documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}), translateConfig);
        // Define the DynamoDB Table
        const CardsTable = new dynamodb_toolbox_1.Table({
            name: process.env["DYNAMODB_CARD_TABLENAME"] || "CardTable",
            partitionKey: "spaceID",
            sortKey: "cardID",
            DocumentClient: this.documentClient,
        });
        // Define the Card Entity
        this.cardEntity = new dynamodb_toolbox_1.Entity({
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
        });
    }
    async create(createCardDto) {
        const cardID = short_uuid_1.default.generate();
        const card = {
            ...createCardDto,
            cardID,
        };
        await this.cardEntity.put(card);
        return card;
    }
    async findAll(spaceID) {
        try {
            const results = await this.cardEntity.query(spaceID);
            return results.Items;
        }
        catch (error) {
            // Handle or throw the error appropriately
            throw new Error(`Error fetching cards for spaceID ${spaceID}: ${error}`);
        }
    }
    async findOne(spaceID, cardID) {
        const result = (await this.cardEntity.get({
            spaceID,
            cardID,
        }));
        return result.Item || null;
    }
    async update(spaceID, cardID, updateCardDto) {
        const updatedCard = (await this.cardEntity.update({
            ...updateCardDto,
            spaceID,
            cardID,
        }, { returnValues: "ALL_NEW" }));
        return updatedCard.Attributes;
    }
    async remove(spaceID, cardID) {
        await this.cardEntity.delete({ spaceID, cardID });
        return { message: "Card deleted successfully." };
    }
};
exports.CardService = CardService;
exports.CardService = CardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CardService);
