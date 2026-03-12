import { IRatingRepository } from "src/domain/repositories/ratting-repository.interface";
import { BaseUseCases } from "../base.usecases";
import { DataSource } from "typeorm";
import { I18nService } from "nestjs-i18n";

export class RatingUsecases extends BaseUseCases {
  constructor(
    private readonly ratingRepository: IRatingRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
}
