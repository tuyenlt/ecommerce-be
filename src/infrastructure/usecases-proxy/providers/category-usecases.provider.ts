import { I18nService } from "nestjs-i18n";
import { CategoryRepository } from "src/infrastructure/repositories/category.repository";
import { CategoryUsecases } from "src/usecases/category/category.usecases";
import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { UseCaseProxy } from "../usecases-proxy";

export default {
  provide: ProxyModule.CATEGORY_USECASES,
  inject: [CategoryRepository, I18nService, DataSource],
  useFactory: (
    categoryRepository: CategoryRepository,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(new CategoryUsecases(categoryRepository, i18n, dataSource));
  },
};
