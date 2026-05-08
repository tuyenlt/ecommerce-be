import { CartEntity } from "src/infrastructure/entities/cart.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ICartRepository extends IBaseRepository<CartEntity> {
  getCartItems(userId: number);
}
