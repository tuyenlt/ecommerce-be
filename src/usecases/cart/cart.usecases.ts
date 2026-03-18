import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";
import { CartEntity } from "src/infrastructure/entities/cart.entity";
import { CartItemEntity } from "src/infrastructure/entities/cart-item.entity";
import { I18nService } from "nestjs-i18n";
import { ICartItemRepository } from "src/domain/repositories/cart-item-repository.interface";
import { AddToCartDto } from "src/infrastructure/controllers/cart/cart.dto";
import { IProductRepository } from "src/domain/repositories/product-repository.interdace";
import { NotFoundException } from "@nestjs/common";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";

export class CartUsecases extends BaseUseCases {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getOrCreateCartByUserId(userId: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOneByFilter({ user_id: userId });
    if (cart) return cart;
    const newCart = this.cartRepository.create({ user_id: userId });
    return await this.cartRepository.create(newCart);
  }

  async addItem(userId: number, dto: AddToCartDto) {
    const cart = await this.getOrCreateCartByUserId(userId);
    const product = await this.productRepository.findOneByFilter({ id: dto.product_id });
    if (!product) {
      throw new NotFoundException(this.i18n.t("product.PRODUCT_NOT_FOUND"));
    }
    const price = product.sale_price || product.base_price || "0";
    const item = this.cartItemRepository.create({
      cart_id: cart.id,
      product_id: dto.product_id,
      quantity: dto.quantity,
      price_at_time: price,
    });
    await this.cartItemRepository.create(item);
  }

  async removeItem(cartItemId: number) {
    const cartItem = await this.cartItemRepository.findOneByFilter({ id: cartItemId });
    if (!cartItem) {
      throw new NotFoundException(this.i18n.t("cart.CART_ITEM_NOT_FOUND"));
    }
    await this.cartItemRepository.delete(cartItemId);
  }

  async getCartWithItems(userId: number) {
    const cart = await this.cartRepository.findOneByFilter({ user_id: userId });
    if (!cart) {
      throw new NotFoundException(this.i18n.t("cart.CART_NOT_FOUND"));
    }
    const cartWithItems = await this.cartRepository.getCartItems(cart.id);
    return cartWithItems;
  }

  async clearCart(cartId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.manager.delete(CartItemEntity, { cart_id: cartId });
    await queryRunner.release();
  }
}
