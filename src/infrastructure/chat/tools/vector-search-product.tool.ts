import { FunctionDeclaration, Type } from "@google/genai";

export const vectorSearchProductTool: FunctionDeclaration = {
  name: "vector_search_products",
  description:
    "Tìm kiếm sản phẩm theo ngữ nghĩa (semantic search) bằng câu hỏi của người dùng. Sử dụng khi cần tìm kiếm thông minh dựa trên nội dung, tính năng hoặc yêu cầu phức tạp thay vì chỉ tìm theo từ khóa chính xác.",
  response: {
    type: Type.OBJECT,
    properties: {
      data: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            product_id: { type: Type.NUMBER },
            embedding_text: { type: Type.STRING },
            score: { type: Type.NUMBER },
          },
        },
      },
    },
  },
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description:
          "Câu truy vấn tìm kiếm tự nhiên của người dùng (vd: 'máy tính văn phòng mỏng nhẹ')",
      },
      k: {
        type: Type.NUMBER,
        description: "Số lượng kết quả cần lấy (mặc định là 5)",
      },
    },
    required: ["query"],
  },
} as const;
