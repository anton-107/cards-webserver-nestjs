import { SetMetadata } from "@nestjs/common";

export type Permission =
  | "list_cards_in_requested_space"
  | "create_card"
  | "update_card"
  | "remove_card";

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata("permissions", permissions);
