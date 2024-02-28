"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesTable = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
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
const documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}), translateConfig);
// Define the DynamoDB Table
exports.SpacesTable = new dynamodb_toolbox_1.Table({
    name: process.env["DYNAMODB_SPACE_TABLENAME"] || "CardTable",
    partitionKey: "spaceID",
    sortKey: "sortKey",
    DocumentClient: documentClient,
});
