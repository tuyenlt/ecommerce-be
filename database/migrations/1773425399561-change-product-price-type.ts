import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProductPriceType1773425399561 implements MigrationInterface {
    name = 'ChangeProductPriceType1773425399561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "base_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "base_price" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sale_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sale_price" character varying(29)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sale_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sale_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "base_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "base_price" numeric(10,2)`);
    }

}
