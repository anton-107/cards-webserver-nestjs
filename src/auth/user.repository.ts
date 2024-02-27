import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  PasswordHashingFunction,
  User,
  UserStore,
} from "authentication-module/dist/authenticator";
import { Entity, Table } from "dynamodb-toolbox";

export const USER_STORE_TYPE = "USER_STORE_TYPE";
export type UserStoreType = "dynamodb" | "in-memory";

export class InMemoryUserRepository implements UserStore {
  private readonly logger = new Logger(InMemoryUserRepository.name);
  private users: User[] = [];

  constructor(
    private configService: ConfigService,
    @Inject("PasswordHashingFunction")
    private hashGenerator: PasswordHashingFunction,
  ) {
    const userStoreType =
      this.configService.get<UserStoreType>(USER_STORE_TYPE);
    if (userStoreType === "in-memory") {
      this.logger.verbose("Generating a demo user");
      this.generateDemoUser();
    }
  }

  private async generateDemoUser() {
    this.addUser({
      username: "testuser1",
      passwordHash: await this.hashGenerator.generateHash("password-1"),
    });
  }

  public async getUserByName(username: string): Promise<User | null> {
    this.logger.verbose("Looking up user name: ", username);
    return this.users.find((u) => u.username === username) || null;
  }
  public async addUser(user: User): Promise<void> {
    this.users.push(user);
  }
}

export class DynamoDBUserRepository implements UserStore {
  private readonly logger = new Logger(DynamoDBUserRepository.name);

  private documentClient: DynamoDBDocumentClient;
  private userEntity: Entity;

  constructor() {
    this.logger.verbose("Initializing DynamoDBUserRepository");
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
    const UserTable = new Table({
      name: process.env["DYNAMODB_USER_TABLENAME"] || "UserTable",
      partitionKey: "username",
      sortKey: "sortKey",
      DocumentClient: this.documentClient,
    });

    // Define the Card Entity
    this.userEntity = new Entity({
      name: "User",
      attributes: {
        username: { partitionKey: true },
        sortKey: { sortKey: true }, // has format of <type>#<id>
        passwordHash: "string",
      },
      table: UserTable,
    } as const);
  }

  async getUserByName(username: string): Promise<User | null> {
    this.logger.verbose("Looking up user name: ", username);
    const entity = (await this.userEntity.get({
      username,
      sortKey: "USER",
    })) as unknown as GetCommandOutput;
    if (!entity.Item) {
      throw Error(`No user found: ${username}`);
    }
    return {
      username: entity.Item.username,
      passwordHash: entity.Item.passwordHash,
    };
  }
  async addUser(user: User): Promise<void> {
    this.logger.verbose("Attempt to add user", user.username);
    throw new Error("Method not implemented.");
  }
}
