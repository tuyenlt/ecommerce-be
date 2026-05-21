import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { OrderUsecases } from "src/usecases/order/order.usecases";
import {
  CreateOrderDto,
  OrderPaginationDto,
  UpdateOrderReceiverInfoDto,
  UpdateOrderStatusDto,
} from "./order.dto";
import { RoleGuard } from "src/infrastructure/common/guards/role.guard";
import { EUserRole } from "src/infrastructure/common/constants/db.constant";

@Controller("orders")
@ApiTags("Orders")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.ORDER_USECASES)
    private readonly orderUseCases: UseCaseProxy<OrderUsecases>,
  ) {
    super();
  }

  @Get("/")
  @UseGuards(new RoleGuard(EUserRole.ADMIN))
  @ApiOperation({ summary: "Get all orders with pagination, admin feature" })
  async getAllOrders(@Query() query: OrderPaginationDto) {
    return await this.orderUseCases.getInstance().getAllOrders(query);
  }

  @Get("/of-user/:user_id")
  @ApiOperation({ summary: "Get all orders of a specific user" })
  @ApiResponse({
    status: 200,
    description: "List of user orders retrieved successfully",
  })
  async getUserOrders(
    @UserContext() user: CurrentUser,
    @Param("user_id", ParseIntPipe) id: number,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException("You are not allowed to access this user's orders");
    }
    return await this.orderUseCases.getInstance().getOrderOfUser(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific order by ID" })
  @ApiResponse({
    status: 200,
    description: "Order details retrieved successfully",
  })
  async getOrderById(@Param("id") id: number, @UserContext() user: CurrentUser) {
    return await this.orderUseCases.getInstance().getOrdersById(user, id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new order from cart items" })
  @ApiResponse({
    status: 201,
    description: "Order created successfully",
  })
  async createOrder(@UserContext() user: CurrentUser, @Body() dto: CreateOrderDto) {
    return await this.orderUseCases.getInstance().createOrderFromCart(user.id, dto);
  }

  @Post(":id/regenerate-payment-url")
  @ApiOperation({ summary: "Regenerate payment URL for an order" })
  @ApiResponse({
    status: 200,
    description: "Payment URL regenerated successfully",
  })
  async regeneratePaymentUrl(@Param("id") id: number) {
    return await this.orderUseCases.getInstance().reGeneratePaymentUrl(id);
  }

  @Post("/:id/status")
  @UseGuards(new RoleGuard(EUserRole.ADMIN))
  @ApiOperation({ summary: "Update order status" })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
  })
  async updateOrderStatus(@Param("id") id: number, @Body() dto: UpdateOrderStatusDto) {
    return await this.orderUseCases.getInstance().UpdateOrderStatus(id, dto);
  }

  @Post("/:id/receiver-info")
  @ApiOperation({ summary: "Update order receiver information" })
  @ApiResponse({
    status: 200,
    description: "Order receiver information updated successfully",
  })
  async updateOrderReceiverInfo(
    @Param("id") id: number,
    @UserContext() user,
    @Body() dto: UpdateOrderReceiverInfoDto,
  ) {
    return await this.orderUseCases.getInstance().UpdateOrderReceiverInfo(user, id, dto);
  }
}
