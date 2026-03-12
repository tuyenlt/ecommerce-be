import { RatingEntity } from "src/infrastructure/entities/rating.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IRatingRepository extends IBaseRepository<RatingEntity> {}
