import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { RatingUsecases } from "src/usecases/rating/rating.usecases";
import { CreateRatingDto, ListRatingDto, ListRatingForAdminDto } from "./rating.dto";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { Public } from "src/infrastructure/common/decorators/public.decorator";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";

@Controller("ratings")
@ApiTags("Ratings")
@UseGuards(JwtAuthGuard)
export class RatingController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.RATING_USECASES)
    private readonly ratingUseCases: UseCaseProxy<RatingUsecases>,
  ) {
    super();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get list of ratings" })
  async getList(@Query() query: ListRatingDto) {
    return this.ratingUseCases.getInstance().getListRating(query);
  }

  @Get("admin")
  @UseGuards(new RoleGuard(EUserRole.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get list of ratings for admin" })
  async getListForAdmin(@Query() query: ListRatingForAdminDto) {
    return this.ratingUseCases.getInstance().getListRattingForAdmin(query);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get rating by ID" })
  async getById(@Param("id") id: number) {
    return this.ratingUseCases.getInstance().getRatingById(id);
  }

  @Post()
  @ApiBearerAuth()
  @Public()
  @ApiOperation({ summary: "Create new rating" })
  async create(@Body() body: CreateRatingDto) {
    return this.ratingUseCases.getInstance().createRating(body, { id: 1 });
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete rating" })
  async delete(@Param("id") id: number, @UserContext() user: CurrentUser) {
    return this.ratingUseCases.getInstance().deleteRating(id, user);
  }
}
