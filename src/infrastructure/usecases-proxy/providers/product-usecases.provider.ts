import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { I18nService } from "nestjs-i18n";
import { ProductUsecases } from "src/usecases/product/product.usecases";
import { UseCaseProxy } from "../usecases-proxy";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";

export default {
  inject: [ProductRepository, I18nService, DataSource],
  provide: ProxyModule.PRODUCT_USECASES,
  useFactory: (productRepository: ProductRepository, i18n: I18nService, dataSource: DataSource) => {
    return new UseCaseProxy(new ProductUsecases(productRepository, i18n, dataSource));
  },
};
