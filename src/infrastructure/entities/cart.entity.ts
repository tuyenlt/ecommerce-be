import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ETableName } from "../common/constants/db.constant";
import { UserEntity } from "./user.entity";
import { CartItemEntity } from "./cart-item.entity";

@Entity(ETableName.CART)
export class CartEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "user_id", type: "bigint", unsigned: true })
  user_id!: number;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  items!: CartItemEntity[];
}
