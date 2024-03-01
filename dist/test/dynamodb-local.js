"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocalCardsTable = exports.createLocalSpacesTable = exports.startDynamoLocal = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dynamodb_local_1 = __importDefault(require("dynamodb-local"));
const sleep = async (sleepMs) => new Promise((resolve) => setTimeout(resolve, sleepMs));
const startDynamoLocal = async (endpointPort) => {
    dynamodb_local_1.default.configureInstaller({
        installPath: "./.dynamodblocal-bin",
    });
    const ddbClient = new client_dynamodb_1.DynamoDBClient({
        endpoint: `http://127.0.0.1:${endpointPort}`,
    });
    const dynamoLocalProcess = await dynamodb_local_1.default.launch(endpointPort, null, [], false, true);
    // wait for local dynamo to initialize:
    const maxRetries = 5;
    const logs = [];
    for (let retries = 0; retries <= maxRetries; retries += 1) {
        try {
            await ddbClient.send(new client_dynamodb_1.ListTablesCommand({}));
            return { ddbClient, dynamoLocalProcess };
        }
        catch (err) {
            logs.push(`Can not send list tables command (this was automatically retried ${maxRetries} times): ${err}`);
            logs.push(err);
            await sleep(3000);
        }
    }
    logs.forEach((log) => {
        // eslint-disable-next-line no-console
        console.log("Log line from attempts of listing tables", log);
    });
    // eslint-disable-next-line no-console
    console.log("dynamoLocalProcess: process info (exit code, standard error, standard output, process object)", dynamoLocalProcess.exitCode, dynamoLocalProcess.stderr, dynamoLocalProcess.stdout, dynamoLocalProcess);
    // eslint-disable-next-line no-console
    console.log("dynamoLocalProcess: try starting to debug", dynamoLocalProcess.spawnargs.join(" "));
    throw Error("Could not initialize local dynamo");
};
exports.startDynamoLocal = startDynamoLocal;
async function createLocalSpacesTable(ddbClient, tableName) {
    try {
        await ddbClient.send(new client_dynamodb_1.CreateTableCommand({
            TableName: tableName,
            KeySchema: [
                { AttributeName: "spaceID", KeyType: "HASH" },
                { AttributeName: "sortKey", KeyType: "RANGE" },
            ],
            AttributeDefinitions: [
                { AttributeName: "spaceID", AttributeType: "S" },
                { AttributeName: "sortKey", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        }));
    }
    catch (e) {
        if (e instanceof AggregateError) {
            // eslint-disable-next-line no-console
            console.log("Aggregate error message", e.message);
            // eslint-disable-next-line no-console
            console.log("Aggregate error name", e.name);
            // eslint-disable-next-line no-console
            console.log("Aggregate errors", e.errors); // [ Error: "some error"
        }
        else {
            // eslint-disable-next-line no-console
            console.log("Generic error", e);
        }
    }
}
exports.createLocalSpacesTable = createLocalSpacesTable;
async function createLocalCardsTable(ddbClient, tableName) {
    try {
        await ddbClient.send(new client_dynamodb_1.CreateTableCommand({
            TableName: tableName,
            KeySchema: [
                { AttributeName: "spaceID", KeyType: "HASH" },
                { AttributeName: "cardID", KeyType: "RANGE" },
            ],
            AttributeDefinitions: [
                { AttributeName: "spaceID", AttributeType: "S" },
                { AttributeName: "cardID", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        }));
    }
    catch (e) {
        if (e instanceof AggregateError) {
            // eslint-disable-next-line no-console
            console.log("Aggregate error message", e.message);
            // eslint-disable-next-line no-console
            console.log("Aggregate error name", e.name);
            // eslint-disable-next-line no-console
            console.log("Aggregate errors", e.errors); // [ Error: "some error"
        }
        else {
            // eslint-disable-next-line no-console
            console.log("Generic error", e);
        }
    }
}
exports.createLocalCardsTable = createLocalCardsTable;
