import {
  CreateTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import DynamoDbLocal from "dynamodb-local";

const sleep = async (sleepMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, sleepMs));

export const startDynamoLocal = async (endpointPort: number) => {
  DynamoDbLocal.configureInstaller({
    installPath: "./.dynamodblocal-bin",
    downloadUrl:
      "https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz",
  });

  const ddbClient = new DynamoDBClient({
    endpoint: `http://127.0.0.1:${endpointPort}`,
  });
  const dynamoLocalProcess = await DynamoDbLocal.launch(
    endpointPort,
    null,
    [],
    false,
    true,
  );

  // wait for local dynamo to initialize:
  for (let retries = 0; retries <= 5; retries += 1) {
    try {
      await ddbClient.send(new ListTablesCommand({}));
      return { ddbClient, dynamoLocalProcess };
    } catch (err) {
      await sleep(3000);
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    "dynamoLocalProcess: process info (exit code, standard error, standard output)",
    dynamoLocalProcess.exitCode,
    dynamoLocalProcess.stderr,
    dynamoLocalProcess.stdout,
  );
  // eslint-disable-next-line no-console
  console.log(
    "dynamoLocalProcess: try starting to debug",
    dynamoLocalProcess.spawnargs.join(" "),
  );
  throw Error("Could not initialize local dynamo");
};

export async function createLocalSpacesTable(
  ddbClient: DynamoDBClient,
  tableName: string,
) {
  try {
    await ddbClient.send(
      new CreateTableCommand({
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
      }),
    );
  } catch (e) {
    if (e instanceof AggregateError) {
      // eslint-disable-next-line no-console
      console.log("Aggregate error message", e.message);
      // eslint-disable-next-line no-console
      console.log("Aggregate error name", e.name);
      // eslint-disable-next-line no-console
      console.log("Aggregate errors", e.errors); // [ Error: "some error"
    } else {
      // eslint-disable-next-line no-console
      console.log("Generic error", e);
    }
  }
}
