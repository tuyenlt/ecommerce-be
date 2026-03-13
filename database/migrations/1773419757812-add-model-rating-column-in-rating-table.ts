import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModelRatingColumnInRatingTable1773419757812 implements MigrationInterface {
    name = 'AddModelRatingColumnInRatingTable1773419757812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" ADD "model_rating" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "model_rating"`);
    }

}
