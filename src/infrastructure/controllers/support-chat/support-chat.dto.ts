import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSupportChatMessageDto {
  @ApiProperty({ description: "Message content" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: "ID of the customer (only used by admin replies)" })
  @IsOptional()
  @IsNumber()
  customerId?: number;
}
