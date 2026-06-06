import { BaseEntity } from "./base.entity";
import { Column, Entity } from "typeorm";
import { ETableName } from "../common/constants/db.constant";

@Entity(ETableName.BANNER)
export class BannerEntity extends BaseEntity {
  @Column({ name: "title", type: "text" })
  title: string;

  @Column({ name: "description", type: "text" })
  description: string;

  @Column({ name: "image_url", type: "text" })
  image_url: string;

  @Column({ name: "redirect_url", type: "text", nullable: true })
  redirect_url: string;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sort_order: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  is_active: boolean;

  @Column({ name: "start_date", type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ name: "end_date", type: "timestamp", nullable: true })
  end_date: Date;
}
