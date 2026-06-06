import { Provider } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { UseCaseProxy } from "../usecases-proxy";
import { FlashSaleUsecases } from "src/usecases/flash-sale/flash-sale.usecases";
import { FlashSaleRepository } from "src/infrastructure/repositories/flash-sale.repository";
import { FlashSaleItemRepository } from "src/infrastructure/repositories/flash-sale-item.repository";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";
import { ProxyModule } from "../modules";

export const flashSaleUsecasesProvider: Provider = {
  provide: ProxyModule.FLASH_SALE_USECASES,
  useFactory: (
    flashSaleRepository: FlashSaleRepository,
    flashSaleItemRepository: FlashSaleItemRepository,
    productRepository: ProductRepository,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new FlashSaleUsecases(
        flashSaleRepository,
        flashSaleItemRepository,
        productRepository,
        i18n,
        dataSource,
      ),
    );
  },
  inject: [
    FlashSaleRepository,
    FlashSaleItemRepository,
    ProductRepository,
    I18nService,
    DataSource,
  ],
};

export default flashSaleUsecasesProvider;
