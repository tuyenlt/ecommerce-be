import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ETableName } from "../common/constants/db.constant";
import { UserEntity } from "./user.entity";
import { CartItemEntity } from "./cart-item.entity";

@Entity(ETableName.CART)
export class CartEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.carts)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "user_id", type: "bigint", unsigned: true })
  user_id!: number;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  items!: CartItemEntity[];
}
