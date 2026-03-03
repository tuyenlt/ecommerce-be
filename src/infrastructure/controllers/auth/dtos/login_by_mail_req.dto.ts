import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginByMailReqDto {
  @ApiProperty({ example: "user@example.com", description: "User email" })
  @IsString()
  email: string;

  @ApiProperty({ example: "password123", description: "User password" })
  @IsString()
  password: string;
}
