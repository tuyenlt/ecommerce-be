import { Controller, Inject } from "@nestjs/common";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { RatingUsecases } from "src/usecases/rating/rating.usecases";

@Controller("ratings")
export class RatingController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.RATING_USECASES)
    private readonly ratingUseCases: UseCaseProxy<RatingUsecases>,
  ) {
    super();
  }
}
