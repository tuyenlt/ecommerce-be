import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETableName } from "../common/constants/db.constant";
import { CategoryEntity } from "../entities/category.entity";
import { BaseCrudRepository } from "./base_crud.repository";

@Injectable()
export class CategoryRepository extends BaseCrudRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository, ETableName.CATEGORY);
  }
}
