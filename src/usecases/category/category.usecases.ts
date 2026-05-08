import { ICategoryRepository } from "src/domain/repositories/category-repository.interface";
import { BaseUseCases } from "../base.usecases";
import { DataSource } from "typeorm";
import { I18nService } from "nestjs-i18n";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "src/infrastructure/controllers/category/category.dto";
import { CategoryEntity } from "src/infrastructure/entities/category.entity";
import { BadRequestException } from "@nestjs/common";

export class CategoryUsecases extends BaseUseCases {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getCategoryTree() {
    const categories = await this.categoryRepository.getAll({
      where: {
        parent_category_id: null,
      },
    });
    return this.buildCategoryTree(categories);
  }

  private buildCategoryTree(categories: CategoryEntity[]): any[] {
    const tree = [];
    let processed = true;
    while (categories.length > 0 && processed) {
      processed = false;
      for (const category of categories) {
        if (category.depth === 1) {
          tree.push({ ...category, subCategories: [] });
          categories = categories.filter((cat) => cat.id !== category.id);
          processed = true;
          continue;
        }
        const parentCategory = this.searchCategoryRecursion(tree, category.parent_category_id);
        if (parentCategory) {
          parentCategory.subCategories.push({ ...category, subCategories: [] });
          categories = categories.filter((cat) => cat.id !== category.id);
          processed = true;
        }
      }
    }
    return tree;
  }

  private searchCategoryRecursion(categories: any, id: number) {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      const found = this.searchCategoryRecursion(category.subCategories, id);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  async getCategoryById(id: number) {
    return await this.categoryRepository.getOneByIdOrFail(id);
  }

  async createCategory(dto: CreateCategoryDto) {
    const existedCatWithSlug = await this.categoryRepository.getAll({
      where: { slug: dto.slug },
    });
    if (existedCatWithSlug.length > 0) {
      throw new BadRequestException(this.i18n.t("category.SLUG_ALREADY_EXISTS"));
    }
    const category = new CategoryEntity();
    category.name = dto.name;
    category.description = dto.description;
    category.image_url = dto.image_url;
    category.slug = dto.slug;
    category.path = await this.generateCategoryPath(dto.parent_category_id);
    category.depth = category.path === "" ? 1 : category.path.split(".").length + 1;
    return await this.categoryRepository.create(category);
  }

  private async generateCategoryPath(parent_category_id: number | null): Promise<string> {
    if (!parent_category_id) {
      return "";
    }
    const parentCategory = await this.categoryRepository.getOneById(parent_category_id);
    return parentCategory.path !== ""
      ? `${parentCategory.path}.${parent_category_id}`
      : `${parent_category_id}`;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.getOneByIdOrFail(id);
    category.name = dto.name;
    category.description = dto.description;
    category.image_url = dto.image_url;
    category.slug = dto.slug;
    category.path = await this.generateCategoryPath(dto.parent_category_id);
    return await this.categoryRepository.updateById(id, category);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.getOneByIdOrFail(id);
    if (!category) {
      throw new BadRequestException(this.i18n.t("category.NOT_FOUND"));
    }
    const childCategories = await this.categoryRepository.getAll({
      where: { parent_category_id: id },
    });
    if (childCategories.length > 0) {
      throw new BadRequestException(this.i18n.t("category.HAS_CHILD_CATEGORIES"));
    }
    return await this.categoryRepository.removeById(id);
  }
}
