import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateOnlineBankUrlAndPriceCol1778583821485 implements MigrationInterface {
    name = 'MigrateOnlineBankUrlAndPriceCol1778583821485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "price_at_time"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "price_at_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shipping_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shipping_fee" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "online_bank_url"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "online_bank_url" character varying(2000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "online_bank_url"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "online_bank_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shipping_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shipping_fee" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_amount" numeric(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "price" numeric(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "price_at_time"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "price_at_time" numeric(15,2) NOT NULL`);
    }

}
