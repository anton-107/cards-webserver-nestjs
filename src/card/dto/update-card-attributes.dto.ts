import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";

import { CardAttributeValue } from "./create-card.dto";

export class UpdateCardAttributesDto {
  @IsObject()
  @ApiProperty()
  attributes: { [key: string]: CardAttributeValue } = {};
}
