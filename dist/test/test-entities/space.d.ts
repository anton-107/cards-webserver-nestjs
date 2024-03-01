import { App } from "supertest/types";
import { User } from "./user";
export declare class TestSpace {
    readonly spaceID: string;
    readonly owner: User;
    constructor(spaceID: string, owner: User);
    create(appServer: App): Promise<import("superagent/lib/node/response")>;
}
//# sourceMappingURL=space.d.ts.map