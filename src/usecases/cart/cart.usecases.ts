import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";
import { I18nService } from "nestjs-i18n";
import { ICartItemRepository } from "src/domain/repositories/cart-item-repository.interface";
import { IProductRepository } from "src/domain/repositories/product-repository.interface";
import { AddToCartDto, RemoveFromCartDto } from "src/infrastructure/controllers/cart/cart.dto";
import { BadRequestException } from "@nestjs/common";

export class CartUsecases extends BaseUseCases {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly productRepository: IProductRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getOrCreateCartByUserId(userId: number) {
    const cart = await this.cartRepository.getOne({ where: { user_id: userId } });
    if (!cart) {
      await this.createCart(userId);
      return [];
    }
    return this.cartRepository.getCartItems(userId);
  }

  async createCart(userId: number) {
    return await this.cartRepository.create({
      user_id: userId,
    });
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    let cart = await this.cartRepository.getOne({
      where: { user_id: userId },
      relations: ["items"],
    });
    if (!cart) {
      cart = await this.createCart(userId);
    }
    const product = await this.productRepository.getOneByIdOrFail(dto.product_id);
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        this.i18n.t("CART.INSUFFICIENT_STOCK", { args: { productName: product.name } }),
      );
    }

    await this.executeTransaction(async (queryRunner) => {
      if (cart.items.find((item) => item.product_id === dto.product_id)) {
        const cartItem = cart.items.find((item) => item.product_id === dto.product_id);
        cartItem.quantity += dto.quantity;
        await this.cartItemRepository.update(
          {
            where: { id: cartItem.id },
          },
          { quantity: cartItem.quantity },
          queryRunner,
        );
      } else {
        // Create cart item with queryRunner
        await this.cartItemRepository.create(
          {
            product_id: dto.product_id,
            cart_id: cart.id,
            quantity: dto.quantity,
            price_at_time: product.sale_price > 0 ? product.sale_price : product.base_price,
          },
          queryRunner,
        );
      }
    });
    return {
      message: this.i18n.t("CART.ADD_SUCCESS", { args: { productName: product.name } }),
    };
  }

  async removeFromCart(userId: number, dto: RemoveFromCartDto) {
    return this.executeTransaction(async (queryRunner) => {
      if (dto.quantity) {
        // Check if cart item exists first
        const cartItem = await this.cartItemRepository.getOne({
          where: { id: dto.cart_item_id },
        });

        if (!cartItem) {
          throw new BadRequestException(this.i18n.t("CART.ITEM_NOT_FOUND"));
        }

        const newQuantity = cartItem.quantity - dto.quantity;
        if (newQuantity <= 0) {
          // Remove item if quantity goes to 0 or below
          await this.cartItemRepository.remove({ where: { id: dto.cart_item_id } }, queryRunner);
        } else {
          // Update quantity using updateById
          await this.cartItemRepository.updateById(dto.cart_item_id, { quantity: newQuantity });
        }
      } else {
        // Remove entire item
        await this.cartItemRepository.remove({ where: { id: dto.cart_item_id } }, queryRunner);
      }

      return {
        message: this.i18n.t("CART.REMOVE_SUCCESS"),
      };
    });
  }
}
