import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductTable1778578860872 implements MigrationInterface {
    name = 'AlterProductTable1778578860872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "unique_code" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "online_bank_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "base_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "base_price" integer`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sale_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sale_price" integer`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'preparing', 'shipped', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('pending', 'paid', 'shipped', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sale_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sale_price" character varying(29)`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "base_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "base_price" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "online_bank_url"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "unique_code"`);
    }

}
