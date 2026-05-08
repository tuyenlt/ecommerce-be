import { I18nService } from "nestjs-i18n";
import { CartUsecases } from "src/usecases/cart/cart.usecases";
import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { CartItemRepository } from "src/infrastructure/repositories/cart-item.repository";
import { CartRepository } from "src/infrastructure/repositories/cart.repository";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";

export default {
  inject: [CartRepository, CartItemRepository, ProductRepository, I18nService, DataSource],
  provide: ProxyModule.CART_USECASES,
  useFactory: (
    cartRepository: CartRepository,
    cartItemRepository: CartItemRepository,
    productRepository: ProductRepository,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new CartUsecases(
      cartRepository,
      cartItemRepository,
      productRepository,
      i18n,
      dataSource,
    );
  },
};
