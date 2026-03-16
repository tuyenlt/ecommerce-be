import { Module } from "@nestjs/common";
import { UsecasesProxyModule } from "../usecases-proxy/modules/usecases-proxy.module";
import { AuthController } from "./auth/auth.controller";
import { CategoryController } from "./category/category.controller";
import { ProductController } from "./product/product.controller";
import { RatingController } from "./rating/rating.controller";
import { UserController } from "./user/user.controller";

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [
    AuthController,
    ProductController,
    CategoryController,
    RatingController,
    UserController,
  ],
})
export class ControllersModule {}
