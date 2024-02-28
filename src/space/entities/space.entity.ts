import { Entity } from "dynamodb-toolbox";

export const SpaceEntity = new Entity({
  name: "Space",
  attributes: {
    spaceID: { partitionKey: true },
    sortKey: { sortKey: true }, // has format of PERMISSION_TO_<permission>

    // space attributes:
    owner: { type: "string" },

    // permissions attributes:
    allowedUsers: { type: "list" },
  },
} as const);

export interface Space {
  spaceID: string;
  owner: string;
}
