import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductVectorEntity } from "../entities/product-vector.entity";
import { BaseCrudRepository } from "./base_crud.repository";
import { IProductVectorRepository } from "src/domain/repositories/product-vector-repository.interface";

@Injectable()
export class ProductVectorRepository
  extends BaseCrudRepository<ProductVectorEntity>
  implements IProductVectorRepository
{
  constructor(
    @InjectRepository(ProductVectorEntity)
    productVectorRepository: Repository<ProductVectorEntity>,
  ) {
    super(productVectorRepository);
  }
}
