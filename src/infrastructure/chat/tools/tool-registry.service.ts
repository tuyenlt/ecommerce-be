import { Injectable } from "@nestjs/common";

import { searchProductsTool } from "./search-product.tool";
import { vectorSearchProductTool } from "./vector-search-product.tool";
import { addToCartTool } from "./add-to-cart.tool";
import { getCartTool } from "./get-cart.tool";
import { createOrderTool } from "./create-order.tool";

@Injectable()
export class ToolRegistryService {
  getTools() {
    return [
      searchProductsTool,
      vectorSearchProductTool,
      addToCartTool,
      getCartTool,
      createOrderTool,
    ];
  }
}
