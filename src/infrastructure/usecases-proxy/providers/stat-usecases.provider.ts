import { ProxyModule } from "../modules";
import { DataSource } from "typeorm";
import { OrderRepository } from "src/infrastructure/repositories/order.repository";
import { ProductRepository } from "src/infrastructure/repositories/product.repository";
import { OrderItemRepository } from "src/infrastructure/repositories/order-item.repository";
import { StatUsecases } from "src/usecases/stat/stat.usecases";
import { UseCaseProxy } from "../usecases-proxy";

export default {
  inject: [OrderRepository, ProductRepository, OrderItemRepository, DataSource],
  provide: ProxyModule.STAT_USECASES,
  useFactory: (
    orderRepository: OrderRepository,
    productRepository: ProductRepository,
    orderItemRepository: OrderItemRepository,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new StatUsecases(orderRepository, orderItemRepository, productRepository, dataSource),
    );
  },
};
