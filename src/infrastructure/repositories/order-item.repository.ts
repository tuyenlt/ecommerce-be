import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseCrudRepository } from "./base_crud.repository";
import { OrderItemEntity } from "../entities/order-item.entity";

@Injectable()
export class OrderItemRepository extends BaseCrudRepository<OrderItemEntity> {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {
    super(orderItemRepository);
  }
}
