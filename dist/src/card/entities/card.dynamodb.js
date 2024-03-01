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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDynamoDBTableFactory = exports.DYNAMOCLIENT_ENDPOINT_OVERRIDE = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
exports.DYNAMOCLIENT_ENDPOINT_OVERRIDE = "DYNAMOCLIENT_ENDPOINT_OVERRIDE";
let CardDynamoDBTableFactory = class CardDynamoDBTableFactory {
    constructor(configService) {
        this.configService = configService;
    }
    build() {
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
        const dynamoDBClientConfig = {};
        const endpointOverride = this.configService.get(exports.DYNAMOCLIENT_ENDPOINT_OVERRIDE);
        if (endpointOverride) {
            dynamoDBClientConfig["endpoint"] = endpointOverride;
        }
        const translateConfig = { marshallOptions, unmarshallOptions };
        // DynamoDB DocumentClient
        const documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient(dynamoDBClientConfig), translateConfig);
        // Define the DynamoDB Table
        return new dynamodb_toolbox_1.Table({
            name: this.configService.get("DYNAMODB_CARD_TABLENAME") || "CardTable",
            partitionKey: "spaceID",
            sortKey: "cardID",
            DocumentClient: documentClient,
        });
    }
};
exports.CardDynamoDBTableFactory = CardDynamoDBTableFactory;
exports.CardDynamoDBTableFactory = CardDynamoDBTableFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CardDynamoDBTableFactory);
