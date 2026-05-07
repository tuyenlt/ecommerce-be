import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductEntity } from "./product.entity";
import { ETableName } from "../common/constants/db.constant";

@Entity(ETableName.CATEGORY)
export class CategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  url!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image_url?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  path: string;

  @Column({ type: "varchar", length: 255 })
  slug: string;

  @Column({ type: "int", nullable: false, default: 1 })
  depth: number;

  @Column({ type: "int", nullable: true })
  parent_category_id!: number;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products!: ProductEntity[];
}
