import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInRequest {
  @IsString()
  @ApiProperty({ example: "testuser1" })
  login: string = "";

  @IsString()
  @ApiProperty({ example: "password-1" })
  password: string = "";
}

export interface SignInSuccessResponse {
  bearerToken: string;
}
export interface SignInErrorResponse {
  signInResult: boolean;
  message: string;
}
