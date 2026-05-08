import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseCrudRepository } from "./base_crud.repository";
import { CartEntity } from "../entities/cart.entity";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";
import { CartItemsResponseDto } from "../controllers/cart/cart.dto";

@Injectable()
export class CartRepository extends BaseCrudRepository<CartEntity> implements ICartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
    super(cartRepository);
  }

  async getCartItems(userId: number): Promise<CartItemsResponseDto[]> {
    const qb = this.cartRepository.createQueryBuilder("cart");
    qb.where("cart.user_id = :userId", { userId });
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
      "product.base_price",
      "product.sale_price",
      "product.images",
    ]);
    const cart = await qb.getOne();

    if (!cart || !cart.items || cart.items.length === 0) {
      return [];
    }

    return cart.items.map((item) => ({
      id: item.id,
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.sale_price > 0 ? item.product.sale_price : item.product.base_price,
      images: item.product.images,
      quantity: item.quantity,
    }));
  }
}
