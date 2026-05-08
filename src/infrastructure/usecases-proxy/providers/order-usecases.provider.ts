import { OrderRepository } from "src/infrastructure/repositories/order.repository";
import { ProxyModule } from "../modules";
import { I18nService } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { CartRepository } from "src/infrastructure/repositories/cart.repository";
import { CartItemRepository } from "src/infrastructure/repositories/cart-item.repository";
import { OrderItemRepository } from "src/infrastructure/repositories/order-item.repository";
import { VNPayBankingService } from "src/infrastructure/services/online-banking/online-banking.service";
import { OrderUsecases } from "src/usecases/order/order.usecases";
import { UseCaseProxy } from "../usecases-proxy";

export default {
  inject: [
    OrderRepository,
    CartRepository,
    CartItemRepository,
    OrderItemRepository,
    VNPayBankingService,
    I18nService,
    DataSource,
  ],
  provide: ProxyModule.ORDER_USECASES,
  useFactory: (
    orderRepository: OrderRepository,
    cartRepository: CartRepository,
    cartItemRepository: CartItemRepository,
    orderItemRepository: OrderItemRepository,
    onlineBankingService: VNPayBankingService,
    i18n: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new OrderUsecases(
        orderRepository,
        cartRepository,
        cartItemRepository,
        orderItemRepository,
        onlineBankingService,
        i18n,
        dataSource,
      ),
    );
  },
};
