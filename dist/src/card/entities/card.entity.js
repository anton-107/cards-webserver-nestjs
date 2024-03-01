"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.СardEntity = void 0;
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
exports.СardEntity = new dynamodb_toolbox_1.Entity({
    name: "Card",
    attributes: {
        spaceID: { partitionKey: true },
        cardID: { sortKey: true }, // has format of <type>#<id>
        id: "string", // id of a resource without card type
        type: "string",
        name: "string",
        parentCardID: { type: "string", required: false }, // Nullable
        attributes: { type: "map" },
    },
});
