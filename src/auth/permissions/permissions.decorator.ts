import { SetMetadata } from "@nestjs/common";

export type Permission = "list_cards_in_requested_space";

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata("permissions", permissions);
