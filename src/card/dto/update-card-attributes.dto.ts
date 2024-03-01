import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";

import { CardAttributeValue } from "./create-card.dto";

export class UpdateCardAttributesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "space-1" })
  spaceID: string = "";

  @IsObject()
  @ApiProperty()
  attributes: { [key: string]: CardAttributeValue } = {};
}
