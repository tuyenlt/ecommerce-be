import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductEntity } from "./product.entity";
import { ETableName } from "../common/constants/db.constant";

@Entity(ETableName.CATEGORY)
export class CategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image_url?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subCategories, { nullable: true })
  @JoinColumn({ name: "parent_category_id" })
  parentCategory!: CategoryEntity;

  @OneToMany(() => CategoryEntity, (subCategory) => subCategory.parentCategory)
  subCategories!: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products!: ProductEntity[];
}
