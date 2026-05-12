import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ETableName } from "../common/constants/db.constant";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "./product.entity";

@Entity(ETableName.CART_ITEM)
export class CartItemEntity extends BaseEntity {
  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({ name: "cart_id" })
  cart!: CartEntity;

  @Column({ name: "cart_id", type: "bigint", unsigned: true })
  cart_id!: number;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "product_id", type: "bigint", unsigned: true })
  product_id!: number;

  @Column({ name: "quantity", type: "int", unsigned: true })
  quantity!: number;

  @Column({ name: "price_at_time", type: "int" })
  price_at_time!: number;
}
