import { Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { ProductEntity } from "../entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EProductSortBy, GetListProductDto } from "../controllers/product/product.dto";
import { PaginationDetails } from "../common/dtos/base.dto";
import { ORDER_DIRECTION } from "../common/constants/common.constant";

@Injectable()
export class ProductRepository extends BaseCrudRepository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
    super(productRepository);
  }

  async getListPagination(query: GetListProductDto): Promise<PaginationDetails> {
    const qb = this.productRepository.createQueryBuilder("product");
    qb.leftJoinAndSelect("product.category", "category");
    qb.skip((query.page - 1) * query.limit).take(query.limit);

    if (query.name) {
      qb.andWhere("product.name ILIKE :name", { name: `%${query.name}%` });
    }
    if (query.category_path) {
      qb.andWhere("category.path LIKE :category", { category: `%${query.category_path}%` });
    }
    if (query.minPrice) {
      qb.andWhere("product.base_price >= :minPrice", { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      qb.andWhere("product.base_price <= :maxPrice", { maxPrice: query.maxPrice });
    }

    qb.select([
      "product.id",
      "product.name",
      "category.name",
      "product.base_price",
      "product.sale_price",
      "product.images",
      "product.created_at",
      "product.stock",
      "product.category_id",
      "product.avg_rating",
    ]);
    if (!query.sortBy) {
      query.sortBy = EProductSortBy.CREATED_AT;
    }

    if (!query.sortOrder) {
      query.sortOrder = ORDER_DIRECTION.DESC;
    }

    qb.orderBy(`product.${query.sortBy}`, query.sortOrder);
    const [data, count] = await qb.getManyAndCount();
    const res = new PaginationDetails();
    res.data = data;
    res.total = count;
    res.page = query.page;
    res.limit = query.limit;
    return res;
  }
}
