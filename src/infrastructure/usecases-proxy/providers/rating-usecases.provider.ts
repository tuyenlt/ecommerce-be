import { I18nService } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { ProxyModule } from "../modules";
import { UseCaseProxy } from "../usecases-proxy";
import { RatingRepository } from "src/infrastructure/repositories/rating.repository";
import { RatingUsecases } from "src/usecases/rating/rating.usecases";

export default {
  provide: ProxyModule.RATING_USECASES,
  inject: [RatingRepository, I18nService, DataSource],
  useFactory: (ratingRepository: RatingRepository, i18n: I18nService, dataSource: DataSource) => {
    return new UseCaseProxy(new RatingUsecases(ratingRepository, i18n, dataSource));
  },
};
