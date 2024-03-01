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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InMemoryUserRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBUserRepository = exports.InMemoryUserRepository = exports.USER_STORE_TYPE = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
exports.USER_STORE_TYPE = "USER_STORE_TYPE";
let InMemoryUserRepository = InMemoryUserRepository_1 = class InMemoryUserRepository {
    constructor(configService, hashGenerator) {
        this.configService = configService;
        this.hashGenerator = hashGenerator;
        this.logger = new common_1.Logger(InMemoryUserRepository_1.name);
        this.users = [];
        const userStoreType = this.configService.get(exports.USER_STORE_TYPE);
        if (userStoreType === "in-memory") {
            this.logger.verbose("Generating a demo user");
            this.generateDemoUsers();
        }
    }
    async generateDemoUsers() {
        this.addUser({
            username: "testuser1",
            passwordHash: await this.hashGenerator.generateHash("password1"),
        });
        this.addUser({
            username: "testuser2",
            passwordHash: await this.hashGenerator.generateHash("password2"),
        });
    }
    async getUserByName(username) {
        this.logger.verbose("Looking up user name: ", username);
        return this.users.find((u) => u.username === username) || null;
    }
    async addUser(user) {
        this.users.push(user);
    }
};
exports.InMemoryUserRepository = InMemoryUserRepository;
exports.InMemoryUserRepository = InMemoryUserRepository = InMemoryUserRepository_1 = __decorate([
    __param(1, (0, common_1.Inject)("PasswordHashingFunction")),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], InMemoryUserRepository);
class DynamoDBUserRepository {
    constructor() {
        this.logger = new common_1.Logger(DynamoDBUserRepository.name);
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
        this.documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}), translateConfig);
        // Define the DynamoDB Table
        const UserTable = new dynamodb_toolbox_1.Table({
            name: process.env["DYNAMODB_USER_TABLENAME"] || "UserTable",
            partitionKey: "username",
            sortKey: "sortKey",
            DocumentClient: this.documentClient,
        });
        // Define the Card Entity
        this.userEntity = new dynamodb_toolbox_1.Entity({
            name: "User",
            attributes: {
                username: { partitionKey: true },
                sortKey: { sortKey: true }, // has format of <type>#<id>
                passwordHash: "string",
            },
            table: UserTable,
        });
    }
    async getUserByName(username) {
        this.logger.verbose("Looking up user name: ", username);
        const entity = (await this.userEntity.get({
            username,
            sortKey: "USER",
        }));
        if (!entity.Item) {
            throw Error(`No user found: ${username}`);
        }
        return {
            username: entity.Item.username,
            passwordHash: entity.Item.passwordHash,
        };
    }
    async addUser(user) {
        this.logger.verbose("Attempt to add user", user.username);
        throw new Error("Method not implemented.");
    }
}
exports.DynamoDBUserRepository = DynamoDBUserRepository;
