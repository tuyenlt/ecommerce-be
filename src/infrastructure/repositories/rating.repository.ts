import { Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { RatingEntity } from "../entities/rating.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IRatingRepository } from "src/domain/repositories/ratting-repository.interface";
import { ListRatingDto } from "../controllers/rating/rating.dto";

@Injectable()
export class RatingRepository
  extends BaseCrudRepository<RatingEntity>
  implements IRatingRepository
{
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {
    super(ratingRepository);
  }

  async getListRating(query: ListRatingDto) {
    const { productId, page, limit } = query;

    const [data, total] = await this.ratingRepository.findAndCount({
      where: productId ? { product_id: productId } : {},
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
