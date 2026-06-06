import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFlashSale1780736151474 implements MigrationInterface {
    name = 'CreateFlashSale1780736151474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flash_sales" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_70299593044ffcba05cc30b97dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flash_sale_items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" integer NOT NULL, "flash_sale_id" integer NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "REL_b9545502793be460c1686ebbc5" UNIQUE ("product_id"), CONSTRAINT "PK_f7be2cbf28d0924336b0d91369a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "flash_sale_item_id" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_a3ce79c5ac6d7059f671b04394e" UNIQUE ("flash_sale_item_id")`);
        await queryRunner.query(`ALTER TABLE "flash_sale_items" ADD CONSTRAINT "FK_b9545502793be460c1686ebbc58" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flash_sale_items" ADD CONSTRAINT "FK_985532d0cb708b5f0905bcb2c98" FOREIGN KEY ("flash_sale_id") REFERENCES "flash_sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_a3ce79c5ac6d7059f671b04394e" FOREIGN KEY ("flash_sale_item_id") REFERENCES "flash_sale_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_a3ce79c5ac6d7059f671b04394e"`);
        await queryRunner.query(`ALTER TABLE "flash_sale_items" DROP CONSTRAINT "FK_985532d0cb708b5f0905bcb2c98"`);
        await queryRunner.query(`ALTER TABLE "flash_sale_items" DROP CONSTRAINT "FK_b9545502793be460c1686ebbc58"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_a3ce79c5ac6d7059f671b04394e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "flash_sale_item_id"`);
        await queryRunner.query(`DROP TABLE "flash_sale_items"`);
        await queryRunner.query(`DROP TABLE "flash_sales"`);
    }

}
