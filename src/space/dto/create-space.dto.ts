import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/)
  @ApiProperty({ example: "space-1" })
  spaceID: string = "";
}
