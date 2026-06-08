export const getCartTool = {
  type: "function",
  function: {
    name: "get_cart",
    description:
      "Lấy danh sách các sản phẩm đang có trong giỏ hàng hiện tại của người dùng. Trả về chi tiết các mặt hàng, id mặt hàng trong giỏ (cart_item_id) và tổng số lượng.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
} as const;
