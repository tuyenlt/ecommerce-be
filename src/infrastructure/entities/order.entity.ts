import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
  ETableName,
} from "../common/constants/db.constant";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { OrderItemEntity } from "./order-item.entity";

@Entity(ETableName.ORDER)
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "user_id", type: "bigint", unsigned: true })
  user_id!: number;

  @Column({ name: "total_amount", type: "decimal", precision: 15, scale: 2 })
  total_amount!: string;

  @Column({ name: "status", type: "enum", enum: EOrderStatus, default: EOrderStatus.PENDING })
  status!: EOrderStatus;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: EPaymentStatus,
    default: EPaymentStatus.UNPAID,
  })
  payment_status!: EPaymentStatus;

  @Column({ name: "shipping_fee", type: "decimal", precision: 15, scale: 2, default: 0 })
  shipping_fee!: string;

  @Column({ name: "payment_method", type: "enum", enum: EPaymentMethod, nullable: true })
  payment_method!: EPaymentMethod;

  @Column({ name: "address", type: "varchar", length: 255 })
  address!: string;

  @Column({ name: "phone", type: "varchar", length: 20 })
  phone!: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items!: OrderItemEntity[];
}
