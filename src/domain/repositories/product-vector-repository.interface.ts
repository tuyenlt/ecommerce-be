import { ProductVectorEntity } from "src/infrastructure/entities/product-vector.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IProductVectorRepository extends IBaseRepository<ProductVectorEntity> {}
