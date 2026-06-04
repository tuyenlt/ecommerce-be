import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { ProductEntity } from "./product.entity";
import { ETableName } from "../common/constants/db.constant";

@Entity(ETableName.RATING)
export class RatingEntity extends BaseEntity {
  @Column({ type: "int" })
  product_id!: number;

  @Column({ type: "int" })
  user_id!: number;

  @Column({ type: "int", nullable: true })
  rating?: number;

  @Column({ type: "text", nullable: true })
  comment?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  model_rating: number;

  @ManyToOne(() => ProductEntity, (product) => product.ratings)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.ratings)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
