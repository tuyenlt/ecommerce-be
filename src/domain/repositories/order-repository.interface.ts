import { OrderEntity } from "src/infrastructure/entities/order.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IOrderRepository extends IBaseRepository<OrderEntity> {
  getOrdersById(orderId: number);
  getListOrderOfUser(userId: number);
}
