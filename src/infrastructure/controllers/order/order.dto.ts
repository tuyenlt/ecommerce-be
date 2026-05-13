import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from "src/infrastructure/common/constants/db.constant";

export class CreateOrderDto {
  @ApiProperty({ description: "The IDs of the products to order", example: [1, 2, 3] })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  cart_items_ids: number[];

  @ApiProperty({
    description: "The shipping address for the order",
    example: "123 Main St, City, Country",
  })
  address: string;

  @ApiProperty({ description: "The phone number for the order", example: "+1234567890" })
  phone: string;

  @ApiProperty({
    description:
      "The payment method for the order, can be one of the following: " +
      Object.values(EPaymentMethod).join(", "),
    example: EPaymentMethod.ONLINE_BANKING,
  })
  payment_method: EPaymentMethod;
}

export class UpdateOrderUserDto {
  @ApiPropertyOptional({
    description: "The shipping address for the order",
    example: "123 Main St, City, Country",
  })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ description: "The phone number for the order", example: "+1234567890" })
  @IsOptional()
  phone: string;
}

export class UpdateOrderAdminDto {
  @ApiPropertyOptional({
    description: "The shipping address for the order",
    example: "123 Main St, City, Country",
  })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ description: "The phone number for the order", example: "+1234567890" })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    description: "The status of the order",
    example: EOrderStatus.SHIPPED,
  })
  @IsOptional()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @ApiPropertyOptional({
    description: "The payment status of the order",
    example: EPaymentStatus.PAID,
  })
  @IsOptional()
  @IsEnum(EPaymentStatus)
  payment_status: EPaymentStatus;
}
