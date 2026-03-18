import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AddToCartDto {
  @ApiProperty({ description: "The ID of the product to add to the cart" })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: "The quantity of the product to add to the cart" })
  @IsNumber()
  quantity: number;
}

export class RemoveFromCartDto {
  @ApiProperty({ description: "The ID of the product to remove from the cart" })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: "The quantity of the product to remove from the cart" })
  @IsNumber()
  quantity: number;
}

export class CheckoutCartDto {
  @ApiProperty({ description: "The shipping address for the order" })
  address: string;

  @ApiProperty({ description: "phone number" })
  phone: string;
}
