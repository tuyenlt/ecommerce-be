import { RatingEntity } from "src/infrastructure/entities/rating.entity";
import { IBaseRepository } from "./base-repository.interface";
import { ListRatingDto } from "src/infrastructure/controllers/rating/rating.dto";

export interface IRatingRepository extends IBaseRepository<RatingEntity> {
  getListRating(query: ListRatingDto): Promise<any>;
}
