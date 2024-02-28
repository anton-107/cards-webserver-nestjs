"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceEntity = void 0;
const dynamodb_toolbox_1 = require("dynamodb-toolbox");
const space_dynamodb_1 = require("./space.dynamodb");
exports.SpaceEntity = new dynamodb_toolbox_1.Entity({
    name: "Space",
    attributes: {
        spaceID: { partitionKey: true },
        sortKey: { sortKey: true }, // has format of PERMISSION_TO_<permission>
        // space attributes:
        owner: { type: 'string' },
        // permissions attributes:
        allowedUsers: { type: "list" },
    },
    table: space_dynamodb_1.SpacesTable,
});
