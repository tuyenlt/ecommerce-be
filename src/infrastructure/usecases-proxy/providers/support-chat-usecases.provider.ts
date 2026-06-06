import { ContactMessageRepository } from "src/infrastructure/repositories/contact-message.repository";
import { SupportChatUseCases } from "src/usecases/support-chat/support-chat.usecases";
import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { UseCaseProxy } from "../usecases-proxy";

export default {
  inject: [ContactMessageRepository, DataSource],
  provide: ProxyModule.SUPPORT_CHAT_USECASES,
  useFactory: (contactMessageRepository: ContactMessageRepository, dataSource: DataSource) =>
    new UseCaseProxy(new SupportChatUseCases(contactMessageRepository, dataSource)),
};
