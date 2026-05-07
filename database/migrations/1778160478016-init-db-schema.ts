import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDbSchema1778160478016 implements MigrationInterface {
    name = 'InitDbSchema1778160478016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "url" character varying(255) NOT NULL, "description" text, "image_url" character varying(255), "path" character varying(255), "slug" character varying(255) NOT NULL, "depth" integer NOT NULL DEFAULT '1', "parent_category_id" integer, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "description" text, "images" text, "base_price" character varying(20), "sale_price" character varying(29), "color" text, "specs" text, "warranty" text, "html_description" text, "stock" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" integer NOT NULL, "user_id" integer NOT NULL, "rating" integer, "comment" text, "model_rating" numeric(10,2), "productId" integer, "userId" integer, CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "cart_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "price_at_time" numeric(15,2) NOT NULL, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, CONSTRAINT "REL_2ec1c94a977b940d85a4f498ae" UNIQUE ("user_id"), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "product_name" character varying(255) NOT NULL, "price" numeric(15,2) NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'paid', 'shipped', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('unpaid', 'paid', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_method_enum" AS ENUM('cod', 'online_banking')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "total_amount" numeric(15,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'unpaid', "shipping_fee" numeric(15,2) NOT NULL DEFAULT '0', "payment_method" "public"."orders_payment_method_enum", "address" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying(255) NOT NULL, "phone" character varying(20), "full_name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar_url" character varying(255), "email_verify_at" TIMESTAMP, "phone_verify_at" TIMESTAMP, "refresh_token" character varying(500), "role" "public"."users_role_enum" NOT NULL DEFAULT '0', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_abcea824a43708933e5ac15a0e4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_abcea824a43708933e5ac15a0e4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
