import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { RatingEntity } from "./rating.entity";
import { CategoryEntity } from "./category.entity";
import { BaseEntity } from "./base.entity";
import { ETableName } from "../common/constants/db.constant";
import { FlashSaleItemEntity } from "./flash-sale-item.entity";

@Entity(ETableName.PRODUCT)
export class ProductEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  images?: string;

  @Column({ type: "int", nullable: true })
  base_price?: number;

  @Column({ type: "int", nullable: true })
  sale_price?: number;

  @Column({ type: "text", nullable: true })
  color?: string;

  @Column({ type: "text", nullable: true })
  specs?: string;

  @Column({ type: "text", nullable: true })
  warranty?: string;

  @Column({ type: "text", nullable: true })
  html_description?: string;

  @Column({ type: "int", nullable: false, default: 0 })
  stock: number;

  @Column({ type: "int", nullable: false, default: 0 })
  purchased: number;

  @Column({ type: "float", nullable: false, default: 0 })
  avg_rating: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @ManyToOne(() => CategoryEntity, (category) => category.products, { nullable: true })
  @JoinColumn({ name: "category_id" })
  category?: CategoryEntity;

  @Column({ name: "category_id", type: "bigint", unsigned: true, nullable: true })
  category_id?: number;

  @OneToMany(() => RatingEntity, (rating) => rating.product)
  ratings!: RatingEntity[];

  @OneToOne(() => FlashSaleItemEntity, (item) => item.product, { nullable: true })
  @JoinColumn({ name: "flash_sale_item_id" })
  flash_sale_item?: FlashSaleItemEntity;

  @Column({ name: "flash_sale_item_id", type: "int", nullable: true })
  flash_sale_item_id?: number;

  flash_sale?: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    start_time: Date;
    end_time: Date;
  } | null;
}
