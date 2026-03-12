import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { RatingEntity } from "../entities/rating.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETableName } from "../common/constants/db.constant";
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
    super(ratingRepository, ETableName.RATING);
  }

  async getListRating(query: ListRatingDto) {
    const { productId, page, limit, sort_by, order_direction } = query;
    const allowedSortFields = ["id", "created_at", "updated_at", "rating"];
    if (!allowedSortFields.includes(sort_by)) {
      throw new BadRequestException("Invalid sort field");
    }
    const [data, total] = await this.ratingRepository.findAndCount({
      where: productId ? { product_id: productId } : {},
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [sort_by]: order_direction,
      },
    });

    return {
      data,
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
