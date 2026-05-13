import { IRatingRepository } from "src/domain/repositories/ratting-repository.interface";
import { BaseUseCases } from "../base.usecases";
import { DataSource } from "typeorm";
import { I18nService } from "nestjs-i18n";
import { CreateRatingDto, ListRatingDto } from "src/infrastructure/controllers/rating/rating.dto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { CurrentUser } from "src/infrastructure/common/decorators/user.decorator";
import { RatingEntity } from "src/infrastructure/entities/rating.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export class RatingUsecases extends BaseUseCases {
  constructor(
    private readonly ratingRepository: IRatingRepository,
    private readonly httpService: HttpService,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getListRating(query: ListRatingDto) {
    return await this.ratingRepository.getListRating(query);
  }

  async createRating(body: CreateRatingDto, user: CurrentUser) {
    const rating = new RatingEntity();
    rating.product_id = body.product_id;
    rating.rating = body.rating;
    rating.comment = body.comment;
    rating.model_rating = await this.getModelRating(body.comment);
    rating.user_id = user.id;
    return await this.ratingRepository.create(rating);
  }

  async getModelRating(comment: string) {
    const serviceURL = "http://host.docker.internal:8000/predict";
    const response = await firstValueFrom(this.httpService.post(serviceURL, { text: comment }));
    return response.data.score;
  }

  async getRatingById(id: number) {
    return await this.findOneByIdOrFail(id);
  }

  async deleteRating(userId: number, id: number) {
    const ratting = await this.findOneByIdOrFail(id);
    if (ratting.user_id !== userId) {
      throw new ForbiddenException(this.i18n.t("rating.FORBIDDEN_DELETE_RATING"));
    }
    return await this.ratingRepository.removeById(id);
  }

  private async findOneByIdOrFail(id: number) {
    const rating = await this.ratingRepository.getOneByIdOrFail(id);
    if (!rating) {
      throw new BadRequestException(this.i18n.t("rating.RATING_NOT_FOUND"));
    }
    return rating;
  }
}
