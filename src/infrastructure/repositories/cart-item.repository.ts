import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseCrudRepository } from "./base_crud.repository";
import { CartItemEntity } from "../entities/cart-item.entity";

@Injectable()
export class CartItemRepository extends BaseCrudRepository<CartItemEntity> {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {
    super(cartItemRepository);
  }
}
