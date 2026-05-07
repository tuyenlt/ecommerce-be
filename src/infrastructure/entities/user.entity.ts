import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ETableName, EUserRole } from "../common/constants/db.constant";
import { RatingEntity } from "./rating.entity";
import { CartEntity } from "./cart.entity";
import { OrderEntity } from "./order.entity";

@Entity(ETableName.USER)
export class UserEntity extends BaseEntity {
  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
  })
  phone?: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  full_name!: string;

  @Column({
    type: "varchar",
    length: 255,
    select: false,
  })
  password!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  avatar_url?: string;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  email_verify_at?: Date;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  phone_verify_at?: Date;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
    select: false,
  })
  refresh_token?: string;

  @Column({
    type: "enum",
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role!: EUserRole;

  @OneToMany(() => RatingEntity, (rating) => rating.user)
  ratings!: RatingEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user)
  cart!: CartEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders!: OrderEntity[];
}
