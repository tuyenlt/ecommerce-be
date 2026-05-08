import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class AddToCartDto {
  @ApiProperty({ description: "The ID of the product to add to the cart" })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: "The quantity of the product to add to the cart" })
  @IsNumber()
  quantity: number;
}

export class RemoveFromCartDto {
  @ApiProperty({ description: "The ID of the cart item to remove from the cart" })
  @IsNumber()
  cart_item_id: number;

  @ApiPropertyOptional({ description: "The quantity of the product to remove from the cart" })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class CartItemsResponseDto {
  @ApiProperty({ description: "The ID of the cart item", example: 1 })
  id: number;

  @ApiProperty({ description: "The ID of the product", example: 1 })
  product_id: number;

  @ApiProperty({ description: "The name of the product", example: "Product 1" })
  name: string;

  @ApiProperty({ description: "The price of the product", example: 100 })
  price: number;

  @ApiProperty({ description: "The images of the product", example: "image1.jpg" })
  images: string;

  @ApiProperty({ description: "The quantity of the product", example: 2 })
  quantity: number;
}
