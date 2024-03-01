import { Entity } from "dynamodb-toolbox";

export interface Card {
  spaceID: string;
  id: string;
  type: string;
  name: string;
  parentCardID: string | null;
  attributes: { [key: string]: string | number | boolean | null };
}

export const СardEntity = new Entity({
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
} as const);
