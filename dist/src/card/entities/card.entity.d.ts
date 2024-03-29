import { Entity } from "dynamodb-toolbox";
export interface Card {
    spaceID: string;
    id: string;
    type: string;
    name: string;
    parentCardID: string | null;
    attributes: {
        [key: string]: string | number | boolean | null;
    };
}
export declare const СardEntity: Entity<"Card", undefined, undefined, undefined, true, true, true, "created", "modified", "entity", false, {
    readonly spaceID: {
        readonly partitionKey: true;
    };
    readonly cardID: {
        readonly sortKey: true;
    };
    readonly id: "string";
    readonly type: "string";
    readonly name: "string";
    readonly parentCardID: {
        readonly type: "string";
        readonly required: false;
    };
    readonly attributes: {
        readonly type: "map";
    };
}, {
    spaceID: {
        partitionKey: true;
    };
    cardID: {
        sortKey: true;
    };
    id: "string";
    type: "string";
    name: "string";
    parentCardID: {
        type: "string";
        required: false;
    };
    attributes: {
        type: "map";
    };
}, import("dynamodb-toolbox/dist/cjs/classes/Entity/types").ParseAttributes<{
    spaceID: {
        partitionKey: true;
    };
    cardID: {
        sortKey: true;
    };
    id: "string";
    type: "string";
    name: "string";
    parentCardID: {
        type: "string";
        required: false;
    };
    attributes: {
        type: "map";
    };
}, true, "created", "modified", "entity", false>, {
    type?: string | undefined;
    name?: string | undefined;
    attributes?: any;
    id?: string | undefined;
    parentCardID?: string | undefined;
    spaceID: any;
    created: string;
    modified: string;
    entity: string;
    cardID: any;
}, {
    type?: string | undefined;
    name?: string | undefined;
    attributes?: any;
    id?: string | undefined;
    parentCardID?: string | undefined;
    spaceID: any;
    created: string;
    modified: string;
    entity: string;
    cardID: any;
}, {
    spaceID: any;
    cardID: any;
}>;
//# sourceMappingURL=card.entity.d.ts.map