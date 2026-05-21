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
import { MULTER_IMAGES_DESTINATION } from "src/infrastructure/config/multer/image-files.interceptor";
import { IStorageDriver } from "src/infrastructure/services/storage/storage.interface";

export class ProductUsecases extends BaseUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly rattingRepository: IRatingRepository,
    private readonly storageService: IStorageDriver,
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

    result.data = result.data.map((product) => {
      return {
        ...product,
        base_price: formatVietnamesePrice(product.base_price),
        sale_price: formatVietnamesePrice(product.sale_price),
      };
    });

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

  async addProduct(body: ProductDto, images: Express.Multer.File[]): Promise<ProductEntity> {
    const category = await this.categoryRepository.getOneByIdOrFail(body.category_id);

    const product = new ProductEntity();
    product.name = body.name;
    product.base_price = body.base_price;
    product.sale_price = body.sale_price;
    product.stock = body.stock;
    product.description = body.description;
    product.category_id = category.id;
    product.color = body.color;
    product.warranty = body.warranty;
    product.is_active = true;

    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
    const imageUrls = images.map(
      (file) => `${DOMAIN}${MULTER_IMAGES_DESTINATION.replace(".", "")}/${file.filename}`,
    );
    product.images = JSON.stringify(imageUrls);

    return await this.productRepository.create(product);
  }

  async updateProduct(id: number, body: ProductDto, images_files: Express.Multer.File[]) {
    const product = await this.findOneByIdOrFail(id);
    product.name = body.name;
    product.base_price = body.base_price;
    product.sale_price = body.sale_price;
    product.stock = body.stock;
    product.description = body.description;
    product.category_id = body.category_id;
    product.color = body.color;
    product.warranty = body.warranty;
    product.is_active = true;

    const currentImageUrls = product.images ? JSON.parse(product.images) : [];
    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
    const newImageUrls = images_files
      .map((file) => `${DOMAIN}${MULTER_IMAGES_DESTINATION.replace(".", "")}/${file.filename}`)
      .concat(body.images ? JSON.parse(body.images) : []);
    const imageToDelete = currentImageUrls.filter((url: string) => !newImageUrls.includes(url));
    const deletedImageFilenames = imageToDelete.map((url: string) => url.split("/").pop());
    for (const filename of deletedImageFilenames) {
      try {
        await this.storageService.delete(`/images/${filename}`);
      } catch (error) {
        console.error(`Failed to delete image ${filename}:`, error);
      }
    }
    product.images = JSON.stringify(newImageUrls);
    await this.productRepository.update({ where: { id } }, product);
    return {
      message: this.i18n.t("product.PRODUCT_UPDATED_SUCCESSFULLY"),
    };
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
