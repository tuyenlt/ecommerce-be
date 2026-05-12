import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { IBaseRepository } from "./base-repository.interface";
import { GetListProductDto } from "src/infrastructure/controllers/product/product.dto";

export interface IProductRepository extends IBaseRepository<ProductEntity> {
  getListPagination(query: GetListProductDto);
}
