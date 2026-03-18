import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseCrudRepository } from "./base_crud.repository";
import { OrderEntity } from "../entities/order.entity";
import { ETableName } from "../common/constants/db.constant";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";

@Injectable()
export class OrderRepository extends BaseCrudRepository<OrderEntity> implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {
    super(orderRepository, ETableName.ORDER);
  }

  async getOrdersById(orderId: number) {
    const qb = this.orderRepository.createQueryBuilder("order");
    qb.where("order.id = :orderId", { orderId });
    qb.leftJoinAndSelect("order.items", "items");
    qb.leftJoin("items.product", "product");
    qb.select([
      "order.id",
      "order.user_id",
      "items.id",
      "items.quantity",
      "items.price_at_time",
      "product.id",
      "product.name",
      "product.price",
      "product.images",
    ]);
    return qb.getOne();
  }

  async getFlattenOrderItemsOfUser(userId: number) {
    const qb = this.orderRepository.createQueryBuilder("order");
    qb.where("order.user_id = :userId", { userId });
    qb.leftJoinAndSelect("order.items", "items");
    qb.leftJoin("items.product", "product");
    qb.select([
      "order.id",
      "order.user_id",
      "items.id",
      "items.quantity",
      "items.price_at_time",
      "product.id",
      "product.name",
      "product.price",
      "product.images",
    ]);
    const orders = await qb.getMany();
    const flattenItems = orders.flatMap((order) => order.items);
    return flattenItems;
  }
}
