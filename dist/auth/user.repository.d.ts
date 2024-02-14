import { User, UserStore } from "authentication-module/dist/authenticator";
export declare class InMemoryUserRepository implements UserStore {
    private users;
    getUserByName(username: string): Promise<User | null>;
    addUser(user: User): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map