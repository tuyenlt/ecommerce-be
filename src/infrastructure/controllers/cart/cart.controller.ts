import { Body, Controller, Delete, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/infrastructure/common/controllers/base.controller";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { CartUsecases } from "src/usecases/cart/cart.usecases";
import { AddToCartDto, CartItemsResponseDto, RemoveFromCartDto } from "./cart.dto";

@Controller()
@ApiTags("Carts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CartController extends BaseController {
  constructor(
    @Inject(UsecasesProxyModule.CART_USECASES)
    private readonly cartUseCases: UseCaseProxy<CartUsecases>,
  ) {
    super();
  }

  @Get("/")
  @ApiOkResponse({ type: [CartItemsResponseDto] })
  async getCart(@UserContext() user: CurrentUser) {
    return this.cartUseCases.getInstance().getOrCreateCartByUserId(user.id);
  }

  @Post("/add-item")
  async addToCart(@UserContext() user: CurrentUser, @Body() dto: AddToCartDto) {
    await this.cartUseCases.getInstance().addToCart(user.id, dto);
  }

  @Delete("/remove-item")
  async removeFromCart(@UserContext() user: CurrentUser, @Body() dto: RemoveFromCartDto) {
    return this.cartUseCases.getInstance().removeFromCart(user.id, dto);
  }
}
