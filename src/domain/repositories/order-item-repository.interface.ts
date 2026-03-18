import { OrderItemEntity } from "src/infrastructure/entities/order-item.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IOrderItemRepository extends IBaseRepository<OrderItemEntity> {}
