import { FunctionDeclaration, Type } from "@google/genai";

export const createOrderTool: FunctionDeclaration = {
  name: "create_order",
  description:
    "Đặt hàng các sản phẩm có trong giỏ hàng. Trước khi gọi tool này, hãy chắc chắn bạn đã gọi tool get_cart để lấy danh sách id mặt hàng trong giỏ (cart_items_ids), và đã hỏi người dùng về địa chỉ, số điện thoại, phương thức thanh toán (COD hoặc ONLINE_BANKING).",
  response: {
    type: Type.OBJECT,
    properties: {
      order_id: { type: Type.NUMBER },
      message: { type: Type.STRING },
    },
  },
  parameters: {
    type: Type.OBJECT,
    properties: {
      cart_items_ids: {
        type: Type.ARRAY,
        items: {
          type: Type.NUMBER,
        },
        description: "Mảng chứa các ID của mặt hàng trong giỏ (cart_item_id) cần đặt",
      },
      address: {
        type: Type.STRING,
        description: "Địa chỉ nhận hàng",
      },
      phone: {
        type: Type.STRING,
        description: "Số điện thoại nhận hàng",
      },
      payment_method: {
        type: Type.STRING,
        description: "Phương thức thanh toán",
        enum: ["cod", "online_banking"],
      },
    },
    required: ["cart_items_ids", "address", "phone", "payment_method"],
  },
} as const;
