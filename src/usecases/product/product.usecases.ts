import { IProductRepository } from "src/domain/repositories/product-repository.interface";
import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { I18nService } from "nestjs-i18n";
import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { GetListProductDto, ProductDto } from "src/infrastructure/controllers/product/product.dto";
import { BadRequestException } from "@nestjs/common";
import { ICategoryRepository } from "src/domain/repositories/category-repository.interface";
import { IRatingRepository } from "src/domain/repositories/ratting-repository.interface";
import { formatVietnamesePrice } from "src/infrastructure/common/utils/common.util";

export class ProductUsecases extends BaseUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly rattingRepository: IRatingRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getListProducts(query: GetListProductDto) {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new BadRequestException(this.i18n.t("product.INVALID_PRICE_RANGE"));
    }
    const category = await this.categoryRepository.getOneByIdOrFail(query.category_id);
    if (category) {
      query.category_path = category.path;
    }

    const result = await this.productRepository.getListPagination(query);

    result.data = await Promise.all(
      result.data.map(async (product) => {
        const ratings = await this.rattingRepository.getAll({
          where: {
            product_id: product.id,
          },
          select: {
            rating: true,
          },
        });

        if (ratings.length > 0) {
          return {
            ...product,
            base_price: formatVietnamesePrice(product.base_price),
            sale_price: formatVietnamesePrice(product.sale_price),
            avg_rating:
              ratings.reduce((acc, rating) => acc + Number(rating.rating), 0) / ratings.length,
          };
        }

        return {
          ...product,
          base_price: formatVietnamesePrice(product.base_price),
          sale_price: formatVietnamesePrice(product.sale_price),
          avg_rating: -1,
        };
      }),
    );

    return result;
  }

  async getProductById(id: number) {
    const product = await this.findOneByIdOrFail(id);
    return {
      ...product,
      base_price: formatVietnamesePrice(product.base_price),
      sale_price: formatVietnamesePrice(product.sale_price),
    };
  }

  async addProduct(body: ProductDto): Promise<ProductEntity> {
    return await this.productRepository.create(body);
  }

  async updateProduct(id: number, body: ProductDto) {
    await this.findOneByIdOrFail(id);
    await this.productRepository.update(
      {
        where: {
          id,
        },
      },
      body,
    );
  }

  async deleteProduct(id: number) {
    await this.findOneByIdOrFail(id);
    await this.productRepository.removeById(id);
  }

  private async findOneByIdOrFail(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.getOne({ where: { id } });
    if (!product) {
      throw new BadRequestException(this.i18n.t("product.PRODUCT_NOT_FOUND"));
    }
    return product;
  }
}
