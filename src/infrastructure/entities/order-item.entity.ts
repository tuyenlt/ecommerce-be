import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ETableName } from "../common/constants/db.constant";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";

@Entity(ETableName.ORDER_ITEMS)
export class OrderItemEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

  @Column({ name: "order_id", type: "bigint", unsigned: true })
  order_id!: number;

  @ManyToOne(() => ProductEntity, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product?: ProductEntity | null;

  @Column({ name: "product_id", type: "bigint", unsigned: true })
  product_id!: number;

  @Column({ name: "product_name", type: "varchar", length: 255 })
  product_name!: string;

  @Column({ name: "price", type: "int" })
  price!: number;

  @Column({ name: "quantity", type: "int", unsigned: true })
  quantity!: number;
}
