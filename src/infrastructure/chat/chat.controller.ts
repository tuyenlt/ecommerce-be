import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { ChatMessageDto } from "./dtos/chat.dto";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { UserContext } from "src/infrastructure/common/decorators/user.decorator";

@Controller("chat")
@ApiTags("Chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("search-products")
  @ApiOperation({
    summary: "Search products using AI chat",
    description: "Send a natural language message to search for products using AI",
  })
  @ApiResponse({
    status: 200,
    description: "Chat response with product search results",
    schema: {
      example: {
        text: "Tôi tìm thấy 5 sản phẩm phù hợp với yêu cầu của bạn...",
        toolResults: [
          {
            toolName: "search_products",
            result: {
              data: [
                {
                  id: 1,
                  name: "Áo thun đỏ",
                  base_price: "250.000 VND",
                  sale_price: "200.000 VND",
                  color: "Đỏ",
                },
              ],
              total: 1,
              page: 1,
              limit: 10,
            },
          },
        ],
      },
    },
  })
  async searchProducts(@Body() dto: ChatMessageDto, @UserContext() user: any) {
    return await this.chatService.chat(dto.message, user);
  }

  @Post("message")
  @ApiOperation({
    summary: "Send a general chat message",
    description: "Send a general message to the AI assistant",
  })
  @ApiResponse({
    status: 200,
    description: "Chat response from AI",
    schema: {
      example: {
        text: "Xin chào! Tôi có thể giúp bạn tìm kiếm sản phẩm, xem thông tin đơn hàng, v.v.",
        toolResults: null,
      },
    },
  })
  async chat(@Body() dto: ChatMessageDto, @UserContext() user: any) {
    return await this.chatService.chat(dto.message, user);
  }
}
