import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { UserEntity } from "../entities/user.entity";
import { UserRepository } from "./user.repository";
import { RatingRepository } from "./rating.repository";
import { ProductEntity } from "../entities/product.entity";
import { CategoryEntity } from "../entities/category.entity";
import { RatingEntity } from "../entities/rating.entity";
import { CategoryRepository } from "./category.repository";
import { ProductRepository } from "./product.repository";
import { CartEntity } from "../entities/cart.entity";
import { OrderEntity } from "../entities/order.entity";
import { CartRepository } from "./cart.repository";
import { OrderRepository } from "./order.repository";
import { CartItemEntity } from "../entities/cart-item.entity";
import { OrderItemEntity } from "../entities/order-item.entity";
import { CartItemRepository } from "./cart-item.repository";
import { OrderItemRepository } from "./order-item.repository";
import { ProductVectorEntity } from "../entities/product-vector.entity";
import { ProductVectorRepository } from "./product-vector.repository";
import { BannerEntity } from "../entities/banner.entity";
import { BannerRepository } from "./banner.repository";
import { ContactMessageEntity } from "../entities/contact-message.entity";
import { ContactMessageRepository } from "./contact-message.repository";

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      UserEntity,
      RatingEntity,
      ProductEntity,
      CategoryEntity,
      CartEntity,
      OrderEntity,
      CartItemEntity,
      OrderItemEntity,
      ProductVectorEntity,
      BannerEntity,
      ContactMessageEntity,
    ]),
  ],
  providers: [
    UserRepository,
    RatingRepository,
    ProductRepository,
    CategoryRepository,
    CartRepository,
    OrderRepository,
    CartItemRepository,
    OrderItemRepository,
    ProductVectorRepository,
    BannerRepository,
    ContactMessageRepository,
  ],
  exports: [
    UserRepository,
    RatingRepository,
    ProductRepository,
    CategoryRepository,
    CartRepository,
    OrderRepository,
    CartItemRepository,
    OrderItemRepository,
    ProductVectorRepository,
    BannerRepository,
    ContactMessageRepository,
  ],
})
export class RepositoriesModule {}
