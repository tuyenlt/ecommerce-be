import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "John Doe", description: "Full name of the user" })
  @IsOptional()
  @IsString()
  full_name: string;

  @ApiPropertyOptional({ example: "+1234567890", description: "Phone number of the user" })
  @IsOptional()
  @IsString()
  phone: string;
}
