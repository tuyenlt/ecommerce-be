import { FunctionDeclaration, Type } from "@google/genai";

export const searchProductsTool: FunctionDeclaration = {
  name: "search_products",
  description:
    "Tìm kiếm sản phẩm theo tên, màu sắc, giá hoặc đặc điểm mà khách hàng yêu cầu. Bạn có thể trích xuất các thông tin chi tiết của sản phẩm (như cấu hình, thông số, tính năng, mô tả) từ trường description và specs trong kết quả trả về để tư vấn.",
  response: {
    type: Type.OBJECT,
    properties: {
      data: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            name: { type: Type.STRING },
            base_price: { type: Type.STRING },
            sale_price: { type: Type.STRING },
            color: { type: Type.STRING },
            description: { type: Type.STRING },
            specs: { type: Type.STRING },
          },
        },
      },
      total: { type: Type.NUMBER },
      page: { type: Type.NUMBER },
      limit: { type: Type.NUMBER },
    },
  },
  parameters: {
    type: Type.OBJECT,
    properties: {
      keyword: {
        type: Type.STRING,
        description: "Từ khóa tìm kiếm (tên sản phẩm, thương hiệu, màu sắc hoặc đặc điểm)",
      },
      minPrice: {
        type: Type.NUMBER,
        description: "Giá tối thiểu (VND), để null nếu không có",
        nullable: true,
      },
      maxPrice: {
        type: Type.NUMBER,
        description: "Giá tối đa (VND), để null nếu không có",
        nullable: true,
      },
      sortBy: {
        type: Type.STRING,
        description:
          "Sắp xếp theo: name (tên), base_price (giá), created_at (mới nhất), avg_rating (đánh giá)",
        enum: ["name", "base_price", "created_at", "avg_rating"],
      },
      sortDirection: {
        type: Type.STRING,
        description: "Thứ tự sắp xếp: ASC (tăng dần) hoặc DESC (giảm dần)",
        enum: ["ASC", "DESC"],
      },
      page: {
        type: Type.NUMBER,
        description: "Số trang (mặc định: 1)",
      },
      limit: {
        type: Type.NUMBER,
        description: "Số lượng sản phẩm mỗi trang (mặc định: 10)",
      },
    },
    required: ["keyword"],
  },
} as const;
