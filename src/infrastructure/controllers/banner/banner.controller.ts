import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { Public } from "src/infrastructure/common/decorators/public.decorator";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { BannerUsecases } from "src/usecases/banner/banner.usecases";
import { CreateBannerDto, UpdateBannerDto } from "./banner.dto";

const BANNER_IMAGE_INTERCEPTOR = FileInterceptor("image", {
  storage: diskStorage({
    destination: "./uploads/images",
    filename: (req, file, callback) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, `${uniqueName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return callback(new BadRequestException("Only image files are allowed"), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

@Controller("banners")
@ApiTags("Banners")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BannerController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.BANNER_USECASES)
    private readonly bannerUseCases: UseCaseProxy<BannerUsecases>,
  ) {
    super();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all active banners" })
  @ApiResponse({
    status: 200,
    description: "List of active banners retrieved successfully",
  })
  async getActiveBanners() {
    return await this.bannerUseCases.getInstance().getActiveBanners();
  }

  @Get("admin/all")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Get all banners (admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of all banners retrieved successfully",
  })
  async getAllBanners() {
    return await this.bannerUseCases.getInstance().getAllBanners();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get a banner by ID" })
  @ApiResponse({
    status: 200,
    description: "Banner retrieved successfully",
  })
  async getBannerById(@Param("id") id: number) {
    return await this.bannerUseCases.getInstance().getBannerById(id);
  }

  @Post()
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(BANNER_IMAGE_INTERCEPTOR)
  @ApiOperation({ summary: "Create a new banner" })
  @ApiResponse({
    status: 201,
    description: "Banner created successfully",
  })
  async createBanner(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException("Image file is required");
    }
    return await this.bannerUseCases.getInstance().createBanner(createBannerDto, image);
  }

  @Put(":id")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(BANNER_IMAGE_INTERCEPTOR)
  @ApiOperation({ summary: "Update a banner by ID" })
  @ApiResponse({
    status: 200,
    description: "Banner updated successfully",
  })
  async updateBanner(
    @Param("id") id: number,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.bannerUseCases.getInstance().updateBanner(id, updateBannerDto, image);
  }

  @Delete(":id")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Delete a banner by ID" })
  @ApiResponse({
    status: 200,
    description: "Banner deleted successfully",
  })
  async deleteBanner(@Param("id") id: number) {
    return await this.bannerUseCases.getInstance().deleteBanner(id);
  }
}
