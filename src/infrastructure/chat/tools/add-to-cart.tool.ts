export const addToCartTool = {
  type: "function",
  function: {
    name: "add_to_cart",
    description:
      "Thêm một sản phẩm vào giỏ hàng của người dùng. Nếu chưa biết ID của sản phẩm, có thể truyền keyword (tên sản phẩm) để hệ thống tự tìm kiếm và thêm vào giỏ hàng.",
    parameters: {
      type: "object",
      properties: {
        product_id: {
          type: ["number", "null"],
          description:
            "ID của sản phẩm cần thêm vào giỏ hàng. Nếu chưa biết ID, hãy truyền null và cung cấp keyword.",
        },
        keyword: {
          type: ["string", "null"],
          description: "Tên hoặc từ khóa sản phẩm để tự động tìm kiếm nếu chưa có ID.",
        },
        quantity: {
          type: ["number", "null"],
          description: "Số lượng sản phẩm muốn thêm (mặc định là 1)",
        },
      },
    },
  },
} as const;
