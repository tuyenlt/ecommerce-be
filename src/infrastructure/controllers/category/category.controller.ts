import { Controller, Inject } from "@nestjs/common";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { CategoryUsecases } from "src/usecases/category/category.usecases";

@Controller("categories")
export class CategoryController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.CATEGORY_USECASES)
    private readonly categoryUseCases: UseCaseProxy<CategoryUsecases>,
  ) {
    super();
  }
}
