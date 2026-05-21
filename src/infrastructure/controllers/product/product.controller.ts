import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { Public } from "src/infrastructure/common/decorators/public.decorator";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { ProductUsecases } from "src/usecases/product/product.usecases";
import { GetListProductDto, ProductDto } from "./product.dto";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { MulterImagesFilesInterceptor } from "src/infrastructure/config/multer/image-files.interceptor";

@Controller("products")
@ApiTags("Products")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.PRODUCT_USECASES)
    private readonly productUseCases: UseCaseProxy<ProductUsecases>,
  ) {
    super();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get list of products" })
  @ApiResponse({
    status: 200,
    description: "List of products retrieved successfully",
  })
  async getProducts(@Query() query: GetListProductDto) {
    return await this.productUseCases.getInstance().getListProducts(query);
  }

  @Post()
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Create a new product" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(MulterImagesFilesInterceptor)
  async createNewProduct(
    @Body() body: ProductDto,
    @UploadedFiles() images_files: Express.Multer.File[],
  ) {
    return await this.productUseCases.getInstance().addProduct(body, images_files);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get a product by ID" })
  async getProduct(@Param("id") id: number) {
    return await this.productUseCases.getInstance().getProductById(id);
  }

  @Put(":id")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Update a product by ID" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(MulterImagesFilesInterceptor)
  async updateProduct(
    @Param("id") id: number,
    @Body() body: ProductDto,
    @UploadedFiles() images_files: Express.Multer.File[],
  ) {
    return await this.productUseCases.getInstance().updateProduct(id, body, images_files);
  }

  @Delete(":id")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Delete a product by ID" })
  async deleteProduct(@Param("id") id: number) {
    return await this.productUseCases.getInstance().deleteProduct(id);
  }
}
