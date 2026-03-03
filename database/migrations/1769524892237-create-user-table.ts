import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1769524892237 implements MigrationInterface {
    name = 'CreateUserTable1769524892237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying(255) NOT NULL, "phone" character varying(20), "full_name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar_url" character varying(255), "email_verify_at" TIMESTAMP, "phone_verify_at" TIMESTAMP, "refresh_token" character varying(500), "role" "public"."users_role_enum" NOT NULL DEFAULT '0', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
