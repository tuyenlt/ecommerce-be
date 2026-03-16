import { I18nService } from "nestjs-i18n";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { UserUseCases } from "src/usecases/user/user.usecases";
import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { UseCaseProxy } from "../usecases-proxy";

export default {
  inject: [UserRepository, I18nService, DataSource],
  provide: ProxyModule.USER_USECASES,
  useFactory: (userRepository: UserRepository, i18n: I18nService, dataSource: DataSource) =>
    new UseCaseProxy(new UserUseCases(userRepository, i18n, dataSource)),
};
