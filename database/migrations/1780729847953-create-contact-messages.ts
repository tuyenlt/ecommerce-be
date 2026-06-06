import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContactMessages1780729847953 implements MigrationInterface {
    name = 'CreateContactMessages1780729847953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contact_messages_type_enum" AS ENUM('customer_to_admin', 'admin_to_customer')`);
        await queryRunner.query(`CREATE TABLE "contact_messages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "content" text NOT NULL, "type" "public"."contact_messages_type_enum" NOT NULL, "is_read" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b74f96eb2edd977ccfba6533293" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banners" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "title" text NOT NULL, "description" text NOT NULL, "image_url" text NOT NULL, "redirect_url" text, "sort_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact_messages" ADD CONSTRAINT "FK_9e5c22b90643dd077c3581f3c3b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT "FK_9e5c22b90643dd077c3581f3c3b"`);
        await queryRunner.query(`DROP TABLE "banners"`);
        await queryRunner.query(`DROP TABLE "contact_messages"`);
        await queryRunner.query(`DROP TYPE "public"."contact_messages_type_enum"`);
    }

}
