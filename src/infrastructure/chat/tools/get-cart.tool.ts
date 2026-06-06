import { FunctionDeclaration, Type } from "@google/genai";

export const getCartTool: FunctionDeclaration = {
  name: "get_cart",
  description: `Lấy danh sách các sản phẩm đang có trong giỏ hàng hiện tại của người dùng. Trả về chi tiết các mặt hàng, id mặt hàng trong giỏ (cart_item_id) và tổng số lượng.
		`,
  response: {
    type: Type.OBJECT,
    properties: {
      message: { type: Type.STRING },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            product_id: { type: Type.NUMBER },
            quantity: { type: Type.NUMBER },
            price_at_time: { type: Type.NUMBER },
          },
        },
      },
    },
  },
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
} as const;
