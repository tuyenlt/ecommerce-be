import { MigrationInterface, QueryRunner } from "typeorm";

export class PrdPurchasedNum1779112688323 implements MigrationInterface {
    name = 'PrdPurchasedNum1779112688323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "purchased" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "purchased"`);
    }

}
