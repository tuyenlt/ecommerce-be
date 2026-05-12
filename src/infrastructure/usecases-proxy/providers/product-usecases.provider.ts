import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { I18nService } from "nestjs-i18n";
import { ProductUsecases } from "src/usecases/product/product.usecases";
import { UseCaseProxy } from "../usecases-proxy";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";
import { CategoryRepository } from "src/infrastructure/repositories/category.repository";
import { RatingRepository } from "src/infrastructure/repositories/rating.repository";

export default {
  inject: [ProductRepository, CategoryRepository, RatingRepository, I18nService, DataSource],
  provide: ProxyModule.PRODUCT_USECASES,
  useFactory: (
    productRepository: ProductRepository,
    categoryRepository: CategoryRepository,
    ratingRepository: RatingRepository,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new ProductUsecases(
        productRepository,
        categoryRepository,
        ratingRepository,
        i18n,
        dataSource,
      ),
    );
  },
};
