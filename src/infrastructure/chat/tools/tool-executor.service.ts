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
  private cleanText(text: string | null | undefined): string {
    if (!text) return "";
    return text
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/\s+/g, " ") // Collapse whitespace/newlines
      .trim();
  }

  private cleanAndTruncate(text: string | null | undefined, maxLength = 200): string {
    const clean = this.cleanText(text);
    if (clean.length <= maxLength) return clean;
    return clean.slice(0, maxLength) + "...";
  }

  private parseAndFormatSpecs(specsStr: string | null | undefined, maxLength = 200): string {
    if (!specsStr) return "";
    try {
      const parsed = typeof specsStr === "string" ? JSON.parse(specsStr) : specsStr;
      if (Array.isArray(parsed)) {
        const formatted = parsed
          .map((spec) => {
            const name = this.cleanText(spec?.name);
            const value = this.cleanText(spec?.value);
            return name && value ? `${name}: ${value}` : "";
          })
          .filter(Boolean)
          .join(", ");
        return this.cleanAndTruncate(formatted, maxLength);
      } else if (typeof parsed === "object" && parsed !== null) {
        const formatted = Object.entries(parsed)
          .map(([key, val]) => {
            const name = this.cleanText(key);
            const value = this.cleanText(String(val));
            return name && value ? `${name}: ${value}` : "";
          })
          .filter(Boolean)
          .join(", ");
        return this.cleanAndTruncate(formatted, maxLength);
      }
    } catch {
      // Fallback to plain text if JSON parsing fails
    }
    return this.cleanAndTruncate(specsStr, maxLength);
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

      const result = await this.productUsecases.getInstance().getListProducts(query);
      return {
        data: result.data.map((product: any) => ({
          id: product.id,
          name: product.name,
          base_price: product.base_price,
          sale_price: product.sale_price,
          color: product.color,
          description: this.cleanAndTruncate(product.description, 200),
          specs: this.parseAndFormatSpecs(product.specs, 200),
          stock: product.stock,
          flash_sale: product.flash_sale,
        })),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to search products: ${error.message}`);
    }
  }

  private async vectorSearchProducts(args: any) {
    try {
      const query = args.query;
      const k = args.k || 5;
      const data = await this.productUsecases.getInstance().topKVectorSearch(query, k);
      return {
        data: data.map((item: any) => ({
          product_id: item.product_id,
          embedding_text: this.cleanAndTruncate(item.embedding_text, 300),
          score: item.score,
        })),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to search products by vector: ${error.message}`);
    }
  }

  private async addToCart(args: any, user: any) {
    try {
      if (!user) throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");

      let productId = args.product_id;
      if (!productId && args.keyword) {
        const searchResult = await this.productUsecases.getInstance().getListProducts({
          name: args.keyword,
          page: 1,
          limit: 1,
        });
        if (searchResult.data && searchResult.data.length > 0) {
          productId = searchResult.data[0].id;
        } else {
          throw new Error(`Không tìm thấy sản phẩm nào khớp với từ khóa "${args.keyword}"`);
        }
      }

      if (!productId) {
        throw new Error("Không thể thêm vào giỏ hàng vì thiếu ID sản phẩm hoặc từ khóa tìm kiếm.");
      }

      return await this.cartUsecases.getInstance().addToCart(user.id, {
        product_id: productId,
        quantity: args.quantity || 1,
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
