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
    let cart = await this.cartRepository.getOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await this.createCart(userId);
    }
    const product = await this.productRepository.getOneByIdOrFail(dto.product_id);
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        this.i18n.t("CART.INSUFFICIENT_STOCK", { args: { productName: product.name } }),
      );
    }
    this.executeTransaction(async (queryRunner) => {
      const cartItem = await this.cartItemRepository.create({
        product_id: dto.product_id,
        cart_id: cart.id,
        quantity: dto.quantity,
      });

      cart.items.push(cartItem);
      await this.cartRepository.create(cart, queryRunner);
      return {
        message: this.i18n.t("CART.ADD_SUCCESS", { args: { productName: product.name } }),
      };
    });
  }

  async removeFromCart(userId: number, dto: RemoveFromCartDto) {
    const cart = await this.cartRepository.getOneOrFail({ where: { user_id: userId } });
    if (dto.quantity) {
      const cartItem = cart.items.find((item) => item.id === dto.cart_item_id);
      if (cartItem) {
        cartItem.quantity -= dto.quantity;
        if (cartItem.quantity <= 0) {
          cart.items = cart.items.filter((item) => item.id !== dto.cart_item_id);
        }
      }
    } else {
      cart.items = cart.items.filter((item) => item.id !== dto.cart_item_id);
    }
    this.executeTransaction(async (queryRunner) => {
      await this.cartItemRepository.remove({ where: { id: dto.cart_item_id } }, queryRunner);
      await this.cartRepository.create(cart, queryRunner);
      return {
        message: this.i18n.t("CART.REMOVE_SUCCESS"),
      };
    });
  }
}
