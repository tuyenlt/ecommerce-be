import { CartItemEntity } from "src/infrastructure/entities/cart-item.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ICartItemRepository extends IBaseRepository<CartItemEntity> {}
