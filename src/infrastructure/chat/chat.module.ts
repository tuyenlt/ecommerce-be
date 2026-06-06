import { Module } from "@nestjs/common";
import { UsecasesProxyModule } from "../usecases-proxy/modules/usecases-proxy.module";
import { ChatService } from "./chat.service";
import { ToolExecutorService } from "./tools/tool-executor.service";
import { OpenAIModule } from "./openai/openai.module";
import { ChatController } from "./chat.controller";
import { ToolRegistryService } from "./tools/tool-registry.service";

@Module({
  imports: [UsecasesProxyModule.register(), OpenAIModule],
  controllers: [ChatController],
  providers: [ChatService, ToolExecutorService, ToolRegistryService],
})
export class ChatModule {}
