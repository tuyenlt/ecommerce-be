import { MigrationInterface, QueryRunner } from "typeorm";

export class PrdAvgRatting1779269696095 implements MigrationInterface {
    name = 'PrdAvgRatting1779269696095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "avg_rating" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "avg_rating"`);
    }

}
