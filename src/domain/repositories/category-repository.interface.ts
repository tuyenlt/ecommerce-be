import { CategoryEntity } from "src/infrastructure/entities/category.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {}
