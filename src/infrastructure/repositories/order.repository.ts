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
      relations: ["items", "items.product", "user"],
      select: {
        id: true,
        status: true,
        payment_status: true,
        payment_method: true,
        phone: true,
        address: true,
        total_amount: true,
        online_bank_url: true,
        user: {
          id: true,
          email: true,
          full_name: true,
        },
        items: {
          id: true,
          quantity: true,
          price: true,
          product: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
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
      "order.status",
      "order.payment_status",
      "order.payment_method",
      "items.id",
      "items.quantity",
      "items.price",
      "product.id",
      "product.name",
      "product.images",
    ]);
    const orders = await qb.getMany();
    return orders;
  }
}
