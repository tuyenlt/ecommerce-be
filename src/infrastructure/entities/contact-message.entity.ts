import { Entity } from "typeorm";
import { EContactMessageType, ETableName } from "../common/constants/db.constant";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { Column, JoinColumn, ManyToOne } from "typeorm";

@Entity(ETableName.CONTACT_MESSAGE)
export class ContactMessageEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;

  @Column({ type: "int", nullable: false })
  user_id: number;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ type: "enum", enum: EContactMessageType, nullable: false })
  type: EContactMessageType;

  @Column({ type: "boolean", default: false })
  is_read: boolean;
}
