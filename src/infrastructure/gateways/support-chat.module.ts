import { Module } from "@nestjs/common";
import { SupportChatGateway } from "./support-chat.gateway";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { JwtModule } from "src/infrastructure/services/jwt/jwt.module";

@Module({
  imports: [UsecasesProxyModule.register(), JwtModule],
  providers: [SupportChatGateway],
  exports: [SupportChatGateway],
})
export class SupportChatModule {}
