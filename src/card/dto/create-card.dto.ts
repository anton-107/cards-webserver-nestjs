import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "space-1" })
  spaceID: string = "";

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Card 1" })
  name: string = "";

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "card-1" })
  parentCardID?: string;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  attributes: { [key: string]: string | number | boolean | null } = {};
}
