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
    const categories = await this.categoryRepository.findByFilter(
      {},
      {
        id: true,
        name: true,
        slug: true,
        image_url: true,
        depth: true,
        parent_category_id: true,
      },
      null,
      { depth: "ASC" },
    );
    return this.buildCategoryTree(categories);
  }

  private buildCategoryTree(categories: CategoryEntity[]): any[] {
    const tree = [];
    for (const category of categories) {
      console.log("Processing category:", category.name, "with depth:", category.depth);
      if (category.depth === 1) {
        tree.push({ ...category, subCategories: [] });
        continue;
      }
      const parentCategory = tree.find((cat) => cat.id === category.parent_category_id);
      if (parentCategory) {
        parentCategory.subCategories.push({ ...category, subCategories: [] });
      }
    }
    return tree;
  }

  async getCategoryById(id: number) {
    return await this.categoryRepository.findOneByFilter({ id });
  }

  async createCategory(dto: CreateCategoryDto) {
    const existedCatWithSlug = await this.categoryRepository.findOneByFilter({ slug: dto.slug });
    if (existedCatWithSlug) {
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
    const parentCategory = await this.categoryRepository.findOneByFilter({
      id: parent_category_id,
    });
    return parentCategory.path !== ""
      ? `${parentCategory.path}.${parent_category_id}`
      : `${parent_category_id}`;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneByFilter({ id });
    if (!category) {
      throw new BadRequestException(this.i18n.t("category.NOT_FOUND"));
    }
    category.name = dto.name;
    category.description = dto.description;
    category.image_url = dto.image_url;
    category.slug = dto.slug;
    category.path = await this.generateCategoryPath(dto.parent_category_id);
    return await this.categoryRepository.update(id, category);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOneByFilter({ id });
    if (!category) {
      throw new BadRequestException(this.i18n.t("category.NOT_FOUND"));
    }
    const childCategories = await this.categoryRepository.findByFilter({ parent_category_id: id });
    if (childCategories.length > 0) {
      throw new BadRequestException(this.i18n.t("category.HAS_CHILD_CATEGORIES"));
    }
    return await this.categoryRepository.delete(id);
  }
}
