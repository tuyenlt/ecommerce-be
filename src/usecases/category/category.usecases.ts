import { ICategoryRepository } from "src/domain/repositories/category-repository.interface";
import { BaseUseCases } from "../base.usecases";
import { DataSource } from "typeorm";
import { I18nService } from "nestjs-i18n";

export class CategoryUsecases extends BaseUseCases {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
}
