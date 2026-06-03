import { FunctionDeclaration, Type } from "@google/genai";

export const addToCartTool: FunctionDeclaration = {
  name: "add_to_cart",
  description:
    "Thêm một sản phẩm vào giỏ hàng của người dùng. Cần cung cấp ID của sản phẩm (product_id) và số lượng muốn thêm.",
  response: {
    type: Type.OBJECT,
    properties: {
      message: { type: Type.STRING },
    },
  },
  parameters: {
    type: Type.OBJECT,
    properties: {
      product_id: {
        type: Type.NUMBER,
        description: "ID của sản phẩm cần thêm vào giỏ hàng",
      },
      quantity: {
        type: Type.NUMBER,
        description: "Số lượng sản phẩm muốn thêm (mặc định là 1)",
      },
    },
    required: ["product_id", "quantity"],
  },
} as const;
