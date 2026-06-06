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
    qb.leftJoin("product.flash_sale_item", "flash_sale_item");
    qb.leftJoin("flash_sale_item.flash_sale", "flash_sale");
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
      "flash_sale_item.id",
      "flash_sale_item.price",
      "flash_sale_item.quantity",
      "flash_sale.id",
      "flash_sale.name",
      "flash_sale.start_time",
      "flash_sale.end_time",
      "flash_sale.is_active",
    ]);
    const cart = await qb.getOne();

    if (!cart || !cart.items || cart.items.length === 0) {
      return [];
    }

    return cart.items.map((item) => {
      const now = new Date();
      const flashSaleItem = item.product.flash_sale_item;
      const flashSale = flashSaleItem?.flash_sale;
      const isFlashSaleActive =
        flashSaleItem &&
        flashSale &&
        flashSale.is_active &&
        new Date(flashSale.start_time) <= now &&
        new Date(flashSale.end_time) >= now;

      const flashSaleInfo = isFlashSaleActive
        ? {
            id: flashSale.id,
            name: flashSale.name,
            price: flashSaleItem.price,
            quantity: flashSaleItem.quantity,
            start_time: flashSale.start_time,
            end_time: flashSale.end_time,
          }
        : null;

      const price = isFlashSaleActive
        ? flashSaleItem.price
        : item.product.sale_price > 0
          ? item.product.sale_price
          : item.product.base_price;

      return {
        id: item.id,
        product_id: item.product.id,
        name: item.product.name,
        price,
        images: item.product.images,
        quantity: item.quantity,
        flash_sale: flashSaleInfo,
      };
    });
  }
}
