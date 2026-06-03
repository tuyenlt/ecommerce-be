import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ChatMessageDto {
  @ApiProperty({
    description: "Chat message from user",
    example: "Tôi muốn tìm một chiếc áo màu đỏ với giá dưới 500 nghìn đồng",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
