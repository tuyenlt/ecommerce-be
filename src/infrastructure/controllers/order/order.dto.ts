import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { EOrderStatus, EPaymentMethod } from "src/infrastructure/common/constants/db.constant";
import { PaginationDto } from "src/infrastructure/common/dtos/base.dto";
import { OrderEntity } from "src/infrastructure/entities/order.entity";

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

export class OrderPaginationDto extends PaginationDto<OrderEntity> {
  @ApiProperty({ description: "Filter by creation date (from)", example: "2023-01-01T00:00:00Z" })
  @Transform(({ value }) => new Date(value))
  created_at_from: Date;

  @ApiProperty({ description: "Filter by creation date (to)", example: "2023-12-31T23:59:59Z" })
  @Transform(({ value }) => new Date(value))
  created_at_to: Date;

  @ApiProperty({ description: "Filter by total amount (from)", example: 100 })
  @Transform(({ value }) => Number(value))
  amount_from: number;

  @ApiProperty({ description: "Filter by total amount (to)", example: 500 })
  @Transform(({ value }) => Number(value))
  amount_to: number;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description:
      "The new status of the order, can be one of the following: " +
      Object.values(EOrderStatus).join(", "),
    example: EOrderStatus.SHIPPED,
  })
  status: EOrderStatus;
}

export class UpdateOrderReceiverInfoDto {
  @ApiProperty({
    description: "The phone number of the receiver",
    example: "+1234567890",
  })
  phone: string;

  @ApiProperty({
    description: "The address of the receiver",
    example: "123 Main St, City, Country",
  })
  address: string;
}

export class GetShippingFeeDto {
  @ApiProperty({
    description: "The shipping address for the order",
    example: "123 Main St, City, Country",
  })
  address: string;
}
