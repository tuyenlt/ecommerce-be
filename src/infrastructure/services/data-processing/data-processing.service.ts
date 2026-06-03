import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { CategoryEntity } from "src/infrastructure/entities/category.entity";
import { ApiClientService } from "../api-client/api-client.service";

@Injectable()
export class DataProcessingService {
  constructor(
    private readonly apiClientService: ApiClientService,
    private readonly dataSource: DataSource,
  ) {}

  async createEmbeddingPassage(text: string): Promise<number[]> {
    const response = await this.apiClientService.post(`${process.env.AI_SERVICE_BASE_URL}/embed`, {
      inputs: [text],
      input_type: "passage",
    });
    return response.embeddings[0];
  }

  async createEmbeddingQuery(text: string): Promise<number[]> {
    const response = await this.apiClientService.post(`${process.env.AI_SERVICE_BASE_URL}/embed`, {
      inputs: [text],
      input_type: "query",
    });
    return response.embeddings[0];
  }

  async createProductTextForEmbedding(product: ProductEntity): Promise<string> {
    const cleanText = (text: string) => {
      if (!text) return "";
      return text
        .replace(/<[^>]*>/g, " ") // Remove HTML tags
        .replace(/\s+/g, " ") // Collapse whitespace/newlines
        .trim();
    };

    const formatPrice = (price?: number) => {
      if (price === undefined || price === null) return "";
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    // 1. Tên sản phẩm
    const name = cleanText(product.name);

    // 2. Danh mục
    let categoryName = product.category?.name || "";
    if (!categoryName && product.category_id) {
      try {
        const category = await this.dataSource
          .getRepository(CategoryEntity)
          .findOne({ where: { id: product.category_id } });
        categoryName = category?.name || "";
      } catch {
        // Fallback to empty if db query fails
      }
    }
    categoryName = cleanText(categoryName);

    // 3. Giá
    const priceVal =
      product.sale_price && product.sale_price > 0 ? product.sale_price : product.base_price;
    const price = formatPrice(priceVal);

    // 4. Mô tả
    const description = cleanText(product.description);

    // 5. Thông số
    let specs = "";
    if (product.specs) {
      try {
        const parsedSpecs =
          typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;
        if (Array.isArray(parsedSpecs)) {
          specs = parsedSpecs
            .map((spec) => {
              const specName = spec?.name ? cleanText(spec.name) : "";
              const specVal = spec?.value ? cleanText(spec.value) : "";
              return specName && specVal ? `${specName}: ${specVal}` : "";
            })
            .filter(Boolean)
            .join(", ");
        } else if (typeof parsedSpecs === "object" && parsedSpecs !== null) {
          specs = Object.entries(parsedSpecs)
            .map(([key, val]) => {
              const specName = cleanText(key);
              const specVal = cleanText(String(val));
              return specName && specVal ? `${specName}: ${specVal}` : "";
            })
            .filter(Boolean)
            .join(", ");
        } else {
          specs = cleanText(String(product.specs));
        }
      } catch {
        specs = cleanText(String(product.specs));
      }
    }

    return `tên sản phẩm: ${name}\ndanh mục: ${categoryName}\ngiá: ${price}\nmô tả: ${description}\nthông số: ${specs}`;
  }
}
