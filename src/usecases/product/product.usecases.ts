import { IProductRepository } from "src/domain/repositories/product-repository.interdace";
import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { I18nService } from "nestjs-i18n";
import * as fs from "fs";
import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { GetListProductDto, ProductDto } from "src/infrastructure/controllers/product/product.dto";
import { BadRequestException } from "@nestjs/common";

export class ProductUsecases extends BaseUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async seedJsonData() {
    // const existingProducts = await this.productRepository.findByFilter({});
    // if (existingProducts.length > 0) {
    //   console.log("Products already exist");
    //   return;
    // }
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
    await this.productRepository.create(entities);
  }

  async getListProducts(query: GetListProductDto) {
    return await this.productRepository.getListPagination(query);
  }

  async getProductById(id: number): Promise<ProductEntity> {
    return await this.findOneByIdOrFail(id);
  }

  async addProduct(body: ProductDto): Promise<ProductEntity> {
    const product = this.productRepository.create(body);
    return await this.productRepository.create(product);
  }

  async updateProduct(id: number, body: ProductDto) {
    await this.findOneByIdOrFail(id);
    await this.productRepository.update(id, body);
  }

  async deleteProduct(id: number) {
    await this.findOneByIdOrFail(id);
    await this.productRepository.delete(id);
  }

  private async findOneByIdOrFail(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOneByFilter({ id });
    if (!product) {
      throw new BadRequestException(this.i18n.t("product.PRODUCT_NOT_FOUND"));
    }
    return product;
  }
}
