import { Body, Controller, Get, Inject, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { OrderUsecases } from "src/usecases/order/order.usecases";
import { CreateOrderDto } from "./order.dto";

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

  @Get()
  @ApiOperation({ summary: "Get all orders of the current user" })
  @ApiResponse({
    status: 200,
    description: "List of user orders retrieved successfully",
  })
  async getUserOrders(@UserContext() user: CurrentUser) {
    return await this.orderUseCases.getInstance().getOrderOfUser(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific order by ID" })
  @ApiResponse({
    status: 200,
    description: "Order details retrieved successfully",
  })
  async getOrderById(@Param("id") id: number) {
    return await this.orderUseCases.getInstance().getOrdersById(id);
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
}
