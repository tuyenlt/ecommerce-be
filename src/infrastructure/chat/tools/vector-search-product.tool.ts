export const vectorSearchProductTool = {
  type: "function",
  function: {
    name: "vector_search_products",
    description:
      "Tìm kiếm sản phẩm theo ngữ nghĩa (semantic search) bằng câu hỏi của người dùng. Sử dụng khi cần tìm kiếm thông minh dựa trên nội dung, tính năng hoặc yêu cầu phức tạp thay vì chỉ tìm theo từ khóa chính xác.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Câu truy vấn tìm kiếm tự nhiên của người dùng (vd: 'máy tính văn phòng mỏng nhẹ')",
        },
        k: {
          type: ["number", "null"],
          description: "Số lượng kết quả cần lấy (mặc định là 5)",
        },
      },
      required: ["query"],
    },
  },
} as const;
