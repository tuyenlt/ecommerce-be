import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductVector1780468319726 implements MigrationInterface {
    name = 'ProductVector1780468319726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_vectors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" bigint NOT NULL, "embedding_text" text, "vector" vector(768) NOT NULL, CONSTRAINT "PK_6526d8cf10fbb6ed12ee94d4c6d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_vectors"`);
    }

}
