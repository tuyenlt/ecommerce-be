import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("product_vectors")
export class ProductVectorEntity extends BaseEntity {
  @Column({
    name: "product_id",
    type: "bigint",
  })
  product_id: number;

  @Column({
    name: "embedding_text",
    type: "text",
    nullable: true,
  })
  embedding_text: string;

  @Column({
    name: "vector",
    type: "vector",
    length: 768,
  })
  vector!: number[];
}
