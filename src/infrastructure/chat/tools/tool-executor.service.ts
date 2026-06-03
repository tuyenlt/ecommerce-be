import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { ProductUsecases } from "src/usecases/product/product.usecases";
import { CartUsecases } from "src/usecases/cart/cart.usecases";
import { OrderUsecases } from "src/usecases/order/order.usecases";
import { GetListProductDto } from "src/infrastructure/controllers/product/product.dto";

@Injectable()
export class ToolExecutorService {
  constructor(
    @Inject(UsecasesProxyModule.PRODUCT_USECASES)
    private readonly productUsecases: UseCaseProxy<ProductUsecases>,
    @Inject(UsecasesProxyModule.CART_USECASES)
    private readonly cartUsecases: UseCaseProxy<CartUsecases>,
    @Inject(UsecasesProxyModule.ORDER_USECASES)
    private readonly orderUsecases: UseCaseProxy<OrderUsecases>,
  ) {}

  async execute(name: string, args: any, user?: any) {
    switch (name) {
      case "search_products":
        return this.searchProducts(args);

      case "vector_search_products":
        return this.vectorSearchProducts(args);

      case "add_to_cart":
        return this.addToCart(args, user);

      case "get_cart":
        return this.getCart(user);

      case "create_order":
        return this.createOrder(args, user);

      default:
        throw new Error(`Unknown tool ${name}`);
    }
  }

  private async searchProducts(args: any) {
    try {
      // Map args to GetListProductDto
      const query: GetListProductDto = {
        // Use keyword to search by name if provided
        name: args.keyword || undefined,
        // Price filters
        minPrice: args.minPrice || undefined,
        maxPrice: args.maxPrice || undefined,
        // Pagination
        page: args.page || 1,
        limit: args.limit || 10,
        // Sort options
        sortBy: args.sortBy || "created_at",
        sortOrder: args.sortDirection || "DESC",
      };

      return await this.productUsecases.getInstance().getListProducts(query);
    } catch (error) {
      throw new BadRequestException(`Failed to search products: ${error.message}`);
    }
  }

  private async vectorSearchProducts(args: any) {
    try {
      const query = args.query;
      const k = args.k || 5;
      const data = await this.productUsecases.getInstance().topKVectorSearch(query, k);
      return { data };
    } catch (error) {
      throw new BadRequestException(`Failed to search products by vector: ${error.message}`);
    }
  }

  private async addToCart(args: any, user: any) {
    try {
      if (!user) throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return await this.cartUsecases.getInstance().addToCart(user.id, {
        product_id: args.product_id,
        quantity: args.quantity,
      });
    } catch (error) {
      throw new BadRequestException(`Failed to add to cart: ${error.message}`);
    }
  }

  private async getCart(user: any) {
    try {
      if (!user) throw new Error("Vui lòng đăng nhập để xem giỏ hàng");
      const items = await this.cartUsecases.getInstance().getOrCreateCartByUserId(user.id);
      return {
        message: "Danh sách sản phẩm trong giỏ hàng",
        items,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get cart: ${error.message}`);
    }
  }

  private async createOrder(args: any, user: any) {
    try {
      if (!user) throw new Error("Vui lòng đăng nhập để đặt hàng");
      return await this.orderUsecases.getInstance().createOrderFromCart(user.id, {
        cart_items_ids: args.cart_items_ids,
        address: args.address,
        phone: args.phone,
        payment_method: args.payment_method,
      });
    } catch (error) {
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }
}
