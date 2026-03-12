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

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([UserEntity, RatingEntity, ProductEntity, CategoryEntity]),
  ],
  providers: [UserRepository, RatingRepository, ProductRepository, CategoryRepository],
  exports: [UserRepository, RatingRepository, ProductRepository, CategoryRepository],
})
export class RepositoriesModule {}
