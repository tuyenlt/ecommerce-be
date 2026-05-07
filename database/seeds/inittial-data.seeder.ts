import { ProductEntity } from "../../src/infrastructure/entities/product.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import * as fs from "fs";
import { CategoryEntity } from "../../src/infrastructure/entities/category.entity";
import { random } from "../../src/infrastructure/common/utils/common.util";

export default class InitialDataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    // Category seeder
    await this.seedCategories(dataSource);
    await this.seedProducts(dataSource);
  }

  async seedProducts(dataSource: DataSource) {
    const productRepository = dataSource.getRepository(ProductEntity);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    const existingProducts = await productRepository.find({});
    if (existingProducts.length > 0) {
      console.log("Products already exist");
      await queryRunner.release();
      return;
    }

    console.log("Seeding products...");

    const productFile = fs.readFileSync("/app/database/seeds/data/items-w-cat.jsonl", "utf8");

    const productLines = productFile.split("\n").filter((line) => line.trim() !== "");

    const products = [];
    for (const line of productLines) {
      products.push(JSON.parse(line));
    }

    console.log(`Loaded ${products.length} products from file.`);

    for (const item of products) {
      try {
        await queryRunner.query(
          `INSERT INTO products (name, stock, description, base_price, sale_price, category_id, warranty, specs, color, images, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
          [
            item.name,
            random(0, 100),
            item.description || null,
            item.base_price || 100000,
            item.sale_price || 0,
            item.category || null,
            item.warranty || null,
            JSON.stringify(item.specs || {}),
            JSON.stringify(item.colors || []),
            JSON.stringify(item.images || []),
          ],
        );
        console.log(`Inserted product: ${item.name} - Category ID: ${item.category}`);
      } catch (error) {
        console.error(`Error inserting product ${item.name}:`, error.message);
      }
    }

    console.log(`Products seeded successfully`);
    await queryRunner.release();
  }

  async seedCategories(dataSource: DataSource) {
    const categoryRepository = dataSource.getRepository(CategoryEntity);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    const existingCategories = await categoryRepository.find({});
    if (existingCategories.length > 0) {
      console.log("Categories already exist");
      await queryRunner.release();
      return;
    }
    const categoryFile = fs.readFileSync("/app/database/seeds/data/category_tree.jsonl", "utf8");

    const categoryLines = categoryFile.split("\n").filter((line) => line.trim() !== "");

    let categories = [];
    for (const line of categoryLines) {
      categories.push(JSON.parse(line));
    }

    // load categories
    while (categories.length > 0) {
      for (const category of categories) {
        if (category.parentId == null) {
          await queryRunner.query(
            `INSERT INTO categories (id, name, url, depth, path, slug, parent_category_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [category.id, category.name, category.url, 1, "", category.url, null],
          );
          console.log(`Inserted category: ${category.id} - ${category.name}`);
          categories = categories.filter((cat) => cat.id !== category.id);
          continue;
        }
        const parentCategory = await categoryRepository.findOneBy({ id: category.parentId });
        if (!parentCategory) {
          continue;
        }
        const path =
          parentCategory.path !== ""
            ? `${parentCategory.path}.${category.id}`
            : `${parentCategory.id}.${category.id}`;
        await queryRunner.query(
          `INSERT INTO categories (id, name, url, depth, path, slug, parent_category_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            category.id,
            category.name,
            category.url,
            parentCategory.depth + 1,
            path,
            category.url,
            parentCategory.id,
          ],
        );
        categories = categories.filter((cat) => cat.id !== category.id);
      }
    }

    console.log("Categories seeded successfully");

    await queryRunner.release();
  }
}
