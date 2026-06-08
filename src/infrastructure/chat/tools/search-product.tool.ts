export const searchProductsTool = {
  type: "function",
  function: {
    name: "search_products",
    description:
      "Tìm kiếm sản phẩm theo tên, màu sắc, giá hoặc đặc điểm mà khách hàng yêu cầu. Bạn có thể trích xuất các thông tin chi tiết của sản phẩm (như cấu hình, thông số, tính năng, mô tả) từ trường description và specs trong kết quả trả về để tư vấn.",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "Từ khóa tìm kiếm (tên sản phẩm, thương hiệu, màu sắc hoặc đặc điểm)",
        },
        minPrice: {
          type: ["number", "null"],
          description: "Giá tối thiểu (VND), để null nếu không có",
        },
        maxPrice: {
          type: ["number", "null"],
          description: "Giá tối đa (VND), để null nếu không có",
        },
        sortBy: {
          type: ["string", "null"],
          description:
            "Sắp xếp theo: name (tên), base_price (giá), created_at (mới nhất), avg_rating (đánh giá)",
          enum: ["name", "base_price", "created_at", "avg_rating", null],
        },
        sortDirection: {
          type: ["string", "null"],
          description: "Thứ tự sắp xếp: ASC (tăng dần) hoặc DESC (giảm dần)",
          enum: ["ASC", "DESC", null],
        },
        page: {
          type: ["number", "null"],
          description: "Số trang (mặc định: 1)",
        },
        limit: {
          type: ["number", "null"],
          description: "Số lượng sản phẩm mỗi trang (mặc định: 10)",
        },
      },
      required: ["keyword"],
    },
  },
} as const;
