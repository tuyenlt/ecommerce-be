import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";
import { I18nService } from "nestjs-i18n";
import { ICartItemRepository } from "src/domain/repositories/cart-item-repository.interface";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";

export class CartUsecases extends BaseUseCases {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
}
