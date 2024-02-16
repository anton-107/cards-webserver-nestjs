import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, NotEquals } from "class-validator";

export class CreateCardDto {
  @IsString()
  @IsOptional()
  @NotEquals(undefined)
  @ApiProperty({
    description: "Parent cards path to root. Post `null` for root-level cards",
    type: "string",
  })
  parentCardPathToRoot: string | null = null;

  @IsNotEmpty()
  @ApiProperty()
  spaceID: string = "";

  @IsNotEmpty()
  @ApiProperty()
  name: string = "";
}
