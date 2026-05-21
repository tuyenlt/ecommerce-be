import { I18nService } from "nestjs-i18n";
import { CategoryRepository } from "src/infrastructure/repositories/category.repository";
import { CategoryUsecases } from "src/usecases/category/category.usecases";
import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { UseCaseProxy } from "../usecases-proxy";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";

export default {
  provide: ProxyModule.CATEGORY_USECASES,
  inject: [CategoryRepository, ProductRepository, I18nService, DataSource],
  useFactory: (
    categoryRepository: CategoryRepository,
    productRepository: ProductRepository,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new CategoryUsecases(categoryRepository, productRepository, i18n, dataSource),
    );
  },
};
