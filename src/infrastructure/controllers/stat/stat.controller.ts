import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { StatUsecases } from "src/usecases/stat/stat.usecases";

@Controller("stats")
@ApiTags("Statistics")
@UseGuards(JwtAuthGuard, new RoleGuard(EUserRole.ADMIN))
@ApiBearerAuth()
export class StatController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.STAT_USECASES)
    private readonly statUsecases: UseCaseProxy<StatUsecases>,
  ) {
    super();
  }

  @Get("revenue-by-month")
  @ApiOperation({ summary: "Get revenue statistics by month" })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year (default: current year)",
  })
  @ApiResponse({
    status: 200,
    description: "Revenue statistics retrieved successfully",
  })
  async getRevenueByMonth(@Query("year") year?: number) {
    return await this.statUsecases.getInstance().getRevenueByMonth(year);
  }

  @Get("orders-by-month")
  @ApiOperation({ summary: "Get order statistics by month" })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year (default: current year)",
  })
  @ApiResponse({
    status: 200,
    description: "Order statistics retrieved successfully",
  })
  async getOrdersByMonth(@Query("year") year?: number) {
    return await this.statUsecases.getInstance().getOrdersByMonth(year);
  }

  @Get("top-selling-products")
  @ApiOperation({ summary: "Get top selling products by month" })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year (default: current year)",
  })
  @ApiQuery({
    name: "month",
    type: "number",
    required: false,
    description: "Month (default: current month)",
  })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: false,
    description: "Limit results (default: 10)",
  })
  @ApiResponse({
    status: 200,
    description: "Top selling products retrieved successfully",
  })
  async getTopSellingProducts(
    @Query("year") year?: number,
    @Query("month") month?: number,
    @Query("limit") limit: number = 10,
  ) {
    return await this.statUsecases.getInstance().getTopSellingProductsByMonth(year, month, limit);
  }

  @Get("total-products")
  @ApiOperation({ summary: "Get total number of products" })
  @ApiResponse({
    status: 200,
    description: "Total products retrieved successfully",
  })
  async getTotalProducts() {
    return await this.statUsecases.getInstance().getTotalProducts();
  }

  @Get("dashboard")
  @ApiOperation({ summary: "Get complete dashboard statistics" })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year (default: current year)",
  })
  @ApiResponse({
    status: 200,
    description: "Dashboard statistics retrieved successfully",
  })
  async getDashboardStats(@Query("year") year?: number) {
    return await this.statUsecases.getInstance().getDashboardStats(year);
  }
}
