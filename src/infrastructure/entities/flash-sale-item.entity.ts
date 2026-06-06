import { ETableName } from "../common/constants/db.constant";
import { BaseEntity } from "./base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { FlashSaleEntity } from "./flash-sale.entity";
import { ProductEntity } from "./product.entity";

@Entity(ETableName.FLASH_SALE_ITEM)
export class FlashSaleItemEntity extends BaseEntity {
  @Column({ type: "bigint" })
  product_id: number;

  @Column({ type: "bigint" })
  flash_sale_id: number;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int" })
  quantity: number;

  @OneToOne(() => ProductEntity, (product) => product.flash_sale_item)
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @ManyToOne(() => FlashSaleEntity, (flashSale) => flashSale.items)
  @JoinColumn({ name: "flash_sale_id" })
  flash_sale: FlashSaleEntity;
}
