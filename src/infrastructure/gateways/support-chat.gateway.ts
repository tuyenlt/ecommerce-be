import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Inject, Logger } from "@nestjs/common";
import { JwtTokenService } from "src/infrastructure/services/jwt/jwt.service";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { SupportChatUseCases } from "src/usecases/support-chat/support-chat.usecases";
import { EContactMessageType, EUserRole } from "src/infrastructure/common/constants/db.constant";
import { TokenPayload } from "src/domain/model/auth";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "support-chat",
})
export class SupportChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SupportChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(UsecasesProxyModule.SUPPORT_CHAT_USECASES)
    private readonly supportChatUseCases: UseCaseProxy<SupportChatUseCases>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token. Disconnecting.`);
        client.disconnect();
        return;
      }

      const payload: TokenPayload = this.jwtTokenService.verifyAccessToken(token);
      client.data.user = payload;

      this.logger.log(
        `Client ${client.id} authenticated as User ${payload.id} (Role: ${payload.role})`,
      );

      if (Number(payload.role) === EUserRole.ADMIN) {
        await client.join("admins");
        this.logger.log(`Admin ${payload.id} joined 'admins' room`);
      } else {
        await client.join(`customer-${payload.id}`);
        this.logger.log(`Customer ${payload.id} joined 'customer-${payload.id}' room`);
      }
    } catch (err) {
      this.logger.error(`Authentication failed for client ${client.id}: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.logger.log(`User ${user.id} disconnected (client: ${client.id})`);
    } else {
      this.logger.log(`Unauthenticated client ${client.id} disconnected`);
    }
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return (
      (client.handshake.auth?.token as string) || (client.handshake.query?.token as string) || null
    );
  }

  @SubscribeMessage("send_message")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string; customerId?: number },
  ) {
    const user = client.data.user as TokenPayload;
    if (!user) {
      client.disconnect();
      return;
    }

    if (!data.content || data.content.trim() === "") {
      return { error: "Content is empty" };
    }

    let targetCustomerId: number;
    let messageType: EContactMessageType;

    if (Number(user.role) === EUserRole.ADMIN) {
      if (!data.customerId) {
        return { error: "customerId is required for admin replies" };
      }
      targetCustomerId = Number(data.customerId);
      messageType = EContactMessageType.ADMIN_TO_CUSTOMER;
    } else {
      targetCustomerId = Number(user.id);
      messageType = EContactMessageType.CUSTOMER_TO_ADMIN;
    }

    const savedMessage = await this.supportChatUseCases
      .getInstance()
      .createMessage(targetCustomerId, data.content, messageType);

    this.server.to(`customer-${targetCustomerId}`).emit("new_message", savedMessage);

    this.server.to("admins").emit("conversation_update", {
      customerId: targetCustomerId,
      message: savedMessage,
    });

    return { success: true, message: savedMessage };
  }

  @SubscribeMessage("join_conversation")
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: number },
  ) {
    const user = client.data.user as TokenPayload;
    if (!user || Number(user.role) !== EUserRole.ADMIN) {
      return { error: "Unauthorized" };
    }

    if (!data.customerId) {
      return { error: "customerId is required" };
    }

    await client.join(`customer-${data.customerId}`);
    this.logger.log(`Admin ${user.id} subscribed to customer-${data.customerId} room`);
    return { success: true, room: `customer-${data.customerId}` };
  }

  @SubscribeMessage("leave_conversation")
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId: number },
  ) {
    const user = client.data.user as TokenPayload;
    if (!user || Number(user.role) !== EUserRole.ADMIN) {
      return { error: "Unauthorized" };
    }

    if (!data.customerId) {
      return { error: "customerId is required" };
    }

    await client.leave(`customer-${data.customerId}`);
    this.logger.log(`Admin ${user.id} unsubscribed from customer-${data.customerId} room`);
    return { success: true };
  }

  @SubscribeMessage("mark_as_read")
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { customerId?: number },
  ) {
    const user = client.data.user as TokenPayload;
    if (!user) {
      return { error: "Unauthorized" };
    }

    let targetCustomerId: number;
    if (Number(user.role) === EUserRole.ADMIN) {
      if (!data.customerId) {
        return { error: "customerId is required for admin" };
      }
      targetCustomerId = Number(data.customerId);
    } else {
      targetCustomerId = Number(user.id);
    }

    await this.supportChatUseCases.getInstance().markMessagesAsRead(targetCustomerId, user.role);

    this.server.to(`customer-${targetCustomerId}`).emit("messages_read", {
      customerId: targetCustomerId,
      readByRole: user.role,
    });

    this.server.to("admins").emit("conversation_update", {
      customerId: targetCustomerId,
      readByRole: user.role,
    });

    return { success: true };
  }
}
