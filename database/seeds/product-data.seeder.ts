import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import * as fs from "fs";

export default class ProductDataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(ProductEntity);

    const existingProducts = await repository.find({});
    if (existingProducts.length > 0) {
      console.log("Products already exist");
      return;
    }
    const filePath = process.cwd() + "/database/seeds/detail_items.jsonl";
    const data = await fs.promises.readFile(filePath, "utf-8");
    const items = data.split("\n").map((line) => {
      return JSON.parse(line);
    });
    const entities: ProductEntity[] = [];
    items.forEach((item) => {
      const entity = new ProductEntity();
      entity.name = item.name;
      entity.description = item.description;
      entity.base_price = item.base_price || 100000;
      entity.sale_price = item.sale_price || 0;
      entity.category = null;
      entity.warranty = item.warranty || null;
      entity.specs = JSON.stringify(item.specs) || null;
      entity.color = JSON.stringify(item.colors) || null;
      entity.images = JSON.stringify(item.images) || null;
      entities.push(entity);
    });
    await repository.save(entities);
  }
}
