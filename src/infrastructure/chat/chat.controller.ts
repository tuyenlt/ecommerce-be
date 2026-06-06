import { Controller, Post, Body, UseGuards, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { ChatMessageDto } from "./dtos/chat.dto";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { Response } from "express";

@Controller("chat")
@ApiTags("Chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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

  @Post("stream")
  @ApiOperation({
    summary: "Stream AI chat assistant responses",
    description:
      "Stream responses from the AI assistant chunk-by-chunk using Server-Sent Events (SSE)",
  })
  async chatStream(@Body() dto: ChatMessageDto, @UserContext() user: any, @Res() res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const generator = this.chatService.chatStream(dto.message, user);
      for await (const chunk of generator) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    } catch (error: any) {
      res.write(`data: ${JSON.stringify({ event: "error", data: error.message })}\n\n`);
    } finally {
      res.end();
    }
  }
}
