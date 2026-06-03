import { Module } from "@nestjs/common";
import { UsecasesProxyModule } from "../usecases-proxy/modules/usecases-proxy.module";
import { AuthController } from "./auth/auth.controller";
import { CategoryController } from "./category/category.controller";
import { ProductController } from "./product/product.controller";
import { RatingController } from "./rating/rating.controller";
import { UserController } from "./user/user.controller";
import { CartController } from "./cart/cart.controller";
import { OrderController } from "./order/order.controller";
import { PaymentController } from "./payment/payment.controller";
import { StatController } from "./stat/stat.controller";
import { OnlineBankingModule } from "../services/online-banking/online-banking.module";

@Module({
  imports: [UsecasesProxyModule.register(), OnlineBankingModule],
  controllers: [
    AuthController,
    ProductController,
    CategoryController,
    RatingController,
    UserController,
    CartController,
    OrderController,
    PaymentController,
    StatController,
  ],
})
export class ControllersModule {}
