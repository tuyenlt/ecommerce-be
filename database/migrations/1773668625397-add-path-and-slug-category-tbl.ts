import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPathAndSlugCategoryTbl1773668625397 implements MigrationInterface {
    name = 'AddPathAndSlugCategoryTbl1773668625397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "path" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "slug" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "path"`);
    }

}
