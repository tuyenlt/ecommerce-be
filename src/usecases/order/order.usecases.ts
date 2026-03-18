import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";
export class OrderUsecases extends BaseUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getOrdersById(orderId: number) {
    return this.orderRepository.getOrdersById(orderId);
  }

  async getListOrderOfUser(userId: number) {
    return this.orderRepository.findByFilter({ user_id: userId });
  }

  async getFlattenOrderItemsOfUser(userId: number) {
    return this.orderRepository.getFlattenOrderItemsOfUser(userId);
  }
}
