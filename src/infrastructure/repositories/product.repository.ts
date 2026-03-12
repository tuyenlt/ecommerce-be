import { Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { ProductEntity } from "../entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETableName } from "../common/constants/db.constant";
import { GetListProductDto } from "../controllers/product/product.dto";
import { BasePaginationResponseDto } from "../common/dtos/base_pagination_response.dto";

@Injectable()
export class ProductRepository extends BaseCrudRepository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
    super(productRepository, ETableName.PRODUCT);
  }

  async getListPagination(query: GetListProductDto): Promise<BasePaginationResponseDto> {
    const qb = this.productRepository.createQueryBuilder("product");
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    if (query.name) {
      qb.andWhere("product.name ILIKE :name", { name: `%${query.name}%` });
    }
    if (query.category) {
      qb.andWhere("product.category = :category", { category: query.category });
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
      "product.base_price",
      "product.sale_price",
      "product.images",
    ]);
    const [data, count] = await qb.getManyAndCount();
    const res = new BasePaginationResponseDto();
    res.data = data;
    res.total = count;
    res.currentPage = query.page;
    res.limit = query.limit;
    res.totalPages = Math.ceil(count / query.limit);
    return res;
  }
}
