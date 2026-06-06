import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { Public } from "src/infrastructure/common/decorators/public.decorator";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { FlashSaleUsecases } from "src/usecases/flash-sale/flash-sale.usecases";
import { CreateFlashSaleDto, UpdateFlashSaleDto, CreateFlashSaleItemDto } from "./flash-sale.dto";

@Controller("flash-sales")
@ApiTags("Flash Sales")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FlashSaleController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.FLASH_SALE_USECASES)
    private readonly flashSaleUseCases: UseCaseProxy<FlashSaleUsecases>,
  ) {
    super();
  }

  @Get("active")
  @Public()
  @ApiOperation({ summary: "Get all active flash sales" })
  @ApiResponse({
    status: 200,
    description: "Active flash sales retrieved successfully",
  })
  async getActiveFlashSales() {
    return await this.flashSaleUseCases.getInstance().getActiveFlashSales();
  }

  @Get()
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Get all flash sales (admin only)" })
  @ApiResponse({
    status: 200,
    description: "All flash sales retrieved successfully",
  })
  async getAllFlashSales() {
    return await this.flashSaleUseCases.getInstance().getAllFlashSales();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get a flash sale by ID" })
  @ApiResponse({
    status: 200,
    description: "Flash sale details retrieved successfully",
  })
  async getFlashSaleById(@Param("id", ParseIntPipe) id: number) {
    return await this.flashSaleUseCases.getInstance().getFlashSaleById(id);
  }

  @Post()
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Create a new flash sale campaign" })
  @ApiResponse({
    status: 201,
    description: "Flash sale campaign created successfully",
  })
  async createFlashSale(@Body() createDto: CreateFlashSaleDto) {
    return await this.flashSaleUseCases.getInstance().createFlashSale(createDto);
  }

  @Put(":id")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Update a flash sale campaign by ID" })
  @ApiResponse({
    status: 200,
    description: "Flash sale campaign updated successfully",
  })
  async updateFlashSale(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateFlashSaleDto,
  ) {
    return await this.flashSaleUseCases.getInstance().updateFlashSale(id, updateDto);
  }

  @Delete(":id")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Delete a flash sale campaign by ID" })
  @ApiResponse({
    status: 200,
    description: "Flash sale campaign deleted successfully",
  })
  async deleteFlashSale(@Param("id", ParseIntPipe) id: number) {
    return await this.flashSaleUseCases.getInstance().deleteFlashSale(id);
  }

  @Post(":id/items")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Add items to an existing flash sale campaign" })
  @ApiResponse({
    status: 200,
    description: "Items added successfully",
  })
  async addItems(
    @Param("id", ParseIntPipe) id: number,
    @Body("items") items: CreateFlashSaleItemDto[],
  ) {
    return await this.flashSaleUseCases.getInstance().addItemsToFlashSale(id, items);
  }

  @Delete(":id/items")
  @UseGuards(new RoleGuard([EUserRole.ADMIN]))
  @ApiOperation({ summary: "Remove items from an existing flash sale campaign" })
  @ApiResponse({
    status: 200,
    description: "Items removed successfully",
  })
  async removeItems(@Param("id", ParseIntPipe) id: number, @Body("itemIds") itemIds: number[]) {
    return await this.flashSaleUseCases.getInstance().removeItemsFromFlashSale(id, itemIds);
  }
}
