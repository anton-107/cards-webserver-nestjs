import { NewCardRequest } from "cards-model/dist/interfaces/requests";
import { IsNotEmpty, IsOptional, IsString, NotEquals } from "class-validator";

export type NewCardRequestDTO = NewCardRequest;

export class NewCardRequestHttpBody {
  @IsString()
  @IsOptional()
  @NotEquals(undefined)
  parentCardPathToRoot: string | null = null;

  @IsNotEmpty()
  spaceID: string = "";

  @IsNotEmpty()
  name: string = "";
}
