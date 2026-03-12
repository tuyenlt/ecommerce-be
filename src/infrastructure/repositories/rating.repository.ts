import { Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { RatingEntity } from "../entities/rating.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETableName } from "../common/constants/db.constant";

@Injectable()
export class RatingRepository extends BaseCrudRepository<RatingEntity> {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {
    super(ratingRepository, ETableName.RATING);
  }
}
