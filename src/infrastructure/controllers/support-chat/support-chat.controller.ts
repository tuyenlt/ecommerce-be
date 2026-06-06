import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/infrastructure/common/dtos/base.dto";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { SupportChatUseCases } from "src/usecases/support-chat/support-chat.usecases";

@Controller("support-chat")
@ApiTags("Support Chat")
@ApiBearerAuth()
export class SupportChatController {
  constructor(
    @Inject(UsecasesProxyModule.SUPPORT_CHAT_USECASES)
    private readonly supportChatUseCases: UseCaseProxy<SupportChatUseCases>,
  ) {}

  @Get("messages")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get customer chat history" })
  @ApiResponse({ status: 200, description: "Messages retrieved successfully" })
  async getMessages(@UserContext() user: CurrentUser, @Query() query: PaginationDto) {
    return await this.supportChatUseCases
      .getInstance()
      .getMessages(user.id, query.page, query.limit);
  }

  @Post("read")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Mark admin messages as read for current customer" })
  @ApiResponse({ status: 200, description: "Messages marked as read" })
  async readMessages(@UserContext() user: CurrentUser) {
    await this.supportChatUseCases.getInstance().markMessagesAsRead(user.id, user.role);
    return { success: true };
  }

  @Get("conversations")
  @UseGuards(JwtAuthGuard, new RoleGuard(EUserRole.ADMIN))
  @ApiOperation({ summary: "Get all customer conversations (Admin only)" })
  @ApiResponse({ status: 200, description: "Conversations list retrieved successfully" })
  async getConversations() {
    return await this.supportChatUseCases.getInstance().getConversations();
  }

  @Get("conversations/:customerId/messages")
  @UseGuards(JwtAuthGuard, new RoleGuard(EUserRole.ADMIN))
  @ApiOperation({ summary: "Get messages for a specific customer (Admin only)" })
  @ApiResponse({ status: 200, description: "Messages retrieved successfully" })
  async getCustomerMessages(
    @Param("customerId", ParseIntPipe) customerId: number,
    @Query() query: PaginationDto,
  ) {
    return await this.supportChatUseCases
      .getInstance()
      .getMessages(customerId, query.page, query.limit);
  }

  @Post("conversations/:customerId/read")
  @UseGuards(JwtAuthGuard, new RoleGuard(EUserRole.ADMIN))
  @ApiOperation({ summary: "Mark customer messages as read (Admin only)" })
  @ApiResponse({ status: 200, description: "Messages marked as read" })
  async readCustomerMessages(
    @Param("customerId", ParseIntPipe) customerId: number,
    @UserContext() user: CurrentUser,
  ) {
    await this.supportChatUseCases.getInstance().markMessagesAsRead(customerId, user.role);
    return { success: true };
  }
}
