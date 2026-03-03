import {
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deleted_at?: Date;
}
