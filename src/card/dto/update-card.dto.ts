import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsObject, IsOptional } from "class-validator";

export class UpdateCardDto {
  @IsEmpty()
  @ApiProperty()
  spaceID?: string | undefined;

  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  attributes: { [key: string]: string | number | boolean | null } = {};
}
