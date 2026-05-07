import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseCrudRepository } from "./base_crud.repository";
import { CartEntity } from "../entities/cart.entity";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";

@Injectable()
export class CartRepository extends BaseCrudRepository<CartEntity> implements ICartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
    super(cartRepository);
  }

  async getCartItems(cartId: number) {
    const qb = await this.cartRepository.createQueryBuilder("cart");
    qb.where("cart.id = :cartId", { cartId });
    qb.leftJoinAndSelect("cart.items", "items");
    qb.leftJoin("items.product", "product");
    qb.select([
      "cart.id",
      "cart.user_id",
      "items.id",
      "items.quantity",
      "items.price_at_time",
      "product.id",
      "product.name",
      "product.price",
      "product.images",
    ]);
    return qb.getMany();
  }
}
