import { IProductRepository } from "src/domain/repositories/product-repository.interdace";
import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { I18nService } from "nestjs-i18n";
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
