import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseCrudRepository } from "./base_crud.repository";
import { OrderEntity } from "../entities/order.entity";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";

@Injectable()
export class OrderRepository extends BaseCrudRepository<OrderEntity> implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {
    super(orderRepository);
  }

  async getOrdersById(orderId: number) {
    const order = await this.getOneById(orderId, {
      relations: ["items", "items.product"],
    });
    return order;
  }

  async getListOrderOfUser(userId: number) {
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
    return orders;
  }
}
