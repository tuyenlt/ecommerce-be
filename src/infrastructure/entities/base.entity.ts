
import {
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @CreateDateColumn({ name: "created_at", type: "datetime2", nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime2", nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime2", nullable: true })
  deleted_at?: Date;
}
