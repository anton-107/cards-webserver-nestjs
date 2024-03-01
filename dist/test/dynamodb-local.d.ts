/// <reference types="node" />
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
export declare const startDynamoLocal: (endpointPort: number) => Promise<{
    ddbClient: DynamoDBClient;
    dynamoLocalProcess: import("child_process").ChildProcess;
}>;
export declare function createLocalSpacesTable(ddbClient: DynamoDBClient, tableName: string): Promise<void>;
export declare function createLocalCardsTable(ddbClient: DynamoDBClient, tableName: string): Promise<void>;
//# sourceMappingURL=dynamodb-local.d.ts.map