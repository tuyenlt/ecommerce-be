import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { I18nService } from "nestjs-i18n";
import { ProductUsecases } from "src/usecases/product/product.usecases";
import { UseCaseProxy } from "../usecases-proxy";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";
import { CategoryRepository } from "src/infrastructure/repositories/category.repository";
import { RatingRepository } from "src/infrastructure/repositories/rating.repository";
import { StorageService } from "src/infrastructure/services/storage/storage.service";
import { DataProcessingService } from "src/infrastructure/services/data-processing/data-processing.service";
import { ProductVectorRepository } from "src/infrastructure/repositories/product-vector.repository";

export default {
  inject: [
    ProductRepository,
    CategoryRepository,
    RatingRepository,
    StorageService,
    DataProcessingService,
    ProductVectorRepository,
    I18nService,
    DataSource,
  ],
  provide: ProxyModule.PRODUCT_USECASES,
  useFactory: (
    productRepository: ProductRepository,
    categoryRepository: CategoryRepository,
    ratingRepository: RatingRepository,
    storageService: StorageService,
    dataProcessingService: DataProcessingService,
    productVectorRepository: ProductVectorRepository,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new ProductUsecases(
        productRepository,
        categoryRepository,
        ratingRepository,
        storageService,
        dataProcessingService,
        productVectorRepository,
        i18n,
        dataSource,
      ),
    );
  },
};
