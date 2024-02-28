import { Entity } from "dynamodb-toolbox";
export declare const SpaceEntity: Entity<"Space", undefined, undefined, import("dynamodb-toolbox/dist/cjs/classes/Table/Table").default<string, "spaceID", "sortKey">, true, true, true, "created", "modified", "entity", false, {
    readonly spaceID: {
        readonly partitionKey: true;
    };
    readonly sortKey: {
        readonly sortKey: true;
    };
    readonly owner: {
        readonly type: "string";
    };
    readonly allowedUsers: {
        readonly type: "list";
    };
}, {
    spaceID: {
        partitionKey: true;
    };
    sortKey: {
        sortKey: true;
    };
    owner: {
        type: "string";
    };
    allowedUsers: {
        type: "list";
    };
}, import("dynamodb-toolbox/dist/cjs/classes/Entity/types").ParseAttributes<{
    spaceID: {
        partitionKey: true;
    };
    sortKey: {
        sortKey: true;
    };
    owner: {
        type: "string";
    };
    allowedUsers: {
        type: "list";
    };
}, true, "created", "modified", "entity", false>, {
    owner?: string | undefined;
    allowedUsers?: any[] | undefined;
    sortKey: any;
    entity: string;
    spaceID: any;
    created: string;
    modified: string;
}, {
    owner?: string | undefined;
    allowedUsers?: any[] | undefined;
    sortKey: any;
    entity: string;
    spaceID: any;
    created: string;
    modified: string;
}, {
    spaceID: any;
    sortKey: any;
}>;
//# sourceMappingURL=space.entity.d.ts.map