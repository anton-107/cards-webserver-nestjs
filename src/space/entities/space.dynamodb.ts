import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Table } from "dynamodb-toolbox";

export const DYNAMOCLIENT_ENDPOINT_OVERRIDE = "DYNAMOCLIENT_ENDPOINT_OVERRIDE";

@Injectable()
export class SpaceDynamoDBTableFactory {
  constructor(private configService: ConfigService) {}
  build(): Table<string, string, string> {
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
    const dynamoDBClientConfig: Record<string, string> = {};
    const endpointOverride = this.configService.get(
      DYNAMOCLIENT_ENDPOINT_OVERRIDE,
    );

    if (endpointOverride) {
      dynamoDBClientConfig["endpoint"] = endpointOverride;
    }

    const translateConfig = { marshallOptions, unmarshallOptions };
    // DynamoDB DocumentClient
    const documentClient = DynamoDBDocumentClient.from(
      new DynamoDBClient(dynamoDBClientConfig),
      translateConfig,
    );

    // Define the DynamoDB Table
    return new Table({
      name: this.configService.get("DYNAMODB_SPACE_TABLENAME") || "SpaceTable",
      partitionKey: "spaceID",
      sortKey: "sortKey",
      DocumentClient: documentClient,
    });
  }
}
