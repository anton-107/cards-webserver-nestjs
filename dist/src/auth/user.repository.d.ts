import { ConfigService } from "@nestjs/config";
import { PasswordHashingFunction, User, UserStore } from "authentication-module/dist/authenticator";
export declare const USER_STORE_TYPE = "USER_STORE_TYPE";
export type UserStoreType = "dynamodb" | "in-memory";
export declare class InMemoryUserRepository implements UserStore {
    private configService;
    private hashGenerator;
    private readonly logger;
    private users;
    constructor(configService: ConfigService, hashGenerator: PasswordHashingFunction);
    private generateDemoUsers;
    getUserByName(username: string): Promise<User | null>;
    addUser(user: User): Promise<void>;
}
export declare class DynamoDBUserRepository implements UserStore {
    private readonly logger;
    private documentClient;
    private userEntity;
    constructor();
    getUserByName(username: string): Promise<User | null>;
    addUser(user: User): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map