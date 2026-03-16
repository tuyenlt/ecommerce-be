import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { Public } from "src/infrastructure/common/decorators/public.decorator";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { CategoryUsecases } from "src/usecases/category/category.usecases";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";

@Controller("categories")
@ApiTags("Categories")
@UseGuards(JwtAuthGuard)
export class CategoryController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.CATEGORY_USECASES)
    private readonly categoryUseCases: UseCaseProxy<CategoryUsecases>,
  ) {
    super();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all categories" })
  async getAllCategories() {
    return this.categoryUseCases.getInstance().getCategoryTree();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get category by ID" })
  async getCategoryById(@Param("id") id: number) {
    return this.categoryUseCases.getInstance().getCategoryById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new category" })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryUseCases.getInstance().createCategory(createCategoryDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a category" })
  async deleteCategory(@Param("id") id: number) {
    return this.categoryUseCases.getInstance().deleteCategory(id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a category" })
  async updateCategory(@Param("id") id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryUseCases.getInstance().updateCategory(id, updateCategoryDto);
  }
}
