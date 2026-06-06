import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FlashSaleItemEntity } from "./flash-sale-item.entity";
import { ETableName } from "../common/constants/db.constant";

@Entity(ETableName.FLASH_SALE)
export class FlashSaleEntity extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", nullable: false })
  start_time: Date;

  @Column({ type: "timestamp", nullable: false })
  end_time: Date;

  @Column({ type: "boolean", nullable: false, default: true })
  is_active: boolean;

  @OneToMany(() => FlashSaleItemEntity, (item) => item.flash_sale)
  items: FlashSaleItemEntity[];
}
