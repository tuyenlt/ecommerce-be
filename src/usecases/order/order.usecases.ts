import { DataSource, In } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";
import { ICartRepository } from "src/domain/repositories/cart-repository.interface";
import {
  CreateOrderDto,
  OrderPaginationDto,
  UpdateOrderReceiverInfoDto,
  UpdateOrderStatusDto,
} from "src/infrastructure/controllers/order/order.dto";
import { ICartItemRepository } from "src/domain/repositories/cart-item-repository.interface";
import { OrderEntity } from "src/infrastructure/entities/order.entity";
import { OrderItemEntity } from "src/infrastructure/entities/order-item.entity";
import { IOrderItemRepository } from "src/domain/repositories/order-item-repository.interface";
import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
  EUserRole,
} from "src/infrastructure/common/constants/db.constant";
import { IOnlineBankingService } from "src/domain/services/online-banking-service.interface";
import * as uuid from "uuid";
import { EQRType } from "src/infrastructure/common/constants/services.constant";
import { I18nService } from "nestjs-i18n";
import { CurrentUser } from "src/infrastructure/common/decorators/user.decorator";
import { buildRangeQueryOperator } from "src/infrastructure/common/utils/query.ultil";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { IProductRepository } from "src/domain/repositories/product-repository.interface";
import { ApiClientService } from "src/infrastructure/services/api-client/api-client.service";
import {
  MIN_SHIPPING_FEE,
  RATE_PER_KM,
  STORE_LAT,
  STORE_LNG,
} from "src/infrastructure/common/constants/common.constant";
export class OrderUsecases extends BaseUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
    private readonly productRepository: IProductRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly onlineBankingService: IOnlineBankingService,
    private readonly apiClientService: ApiClientService,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getOrdersById(user: CurrentUser, orderId: number) {
    const order = await this.orderRepository.getOrdersById(orderId);
    if (order.user.id !== user.id && user.role !== EUserRole.ADMIN)
      throw new ForbiddenException(this.i18n.t("ORDER.ACCESS_DENIED"));
    return order;
  }

  async getAllOrders(query: OrderPaginationDto) {
    const createdAtOperator = buildRangeQueryOperator(
      "created_at",
      query.created_at_from,
      query.created_at_to,
    );
    const amountOperator = buildRangeQueryOperator(
      "total_amount",
      query.amount_from,
      query.amount_to,
    );

    const filters = [];
    if (createdAtOperator) filters.push(createdAtOperator);
    if (amountOperator) filters.push(amountOperator);
    if (filters.length !== 0) {
      if (query.filter) {
        filters.push(query.filter);
      }
      query.filter = filters;
    }
    const result = await this.orderRepository.getAllPaginated({
      ...query,
      relations: ["items", "user"],
    });
    result.data = result.data.map((order) => {
      return {
        ...order,
        total_product: order.items.reduce((total, item) => total + item.quantity, 0),
      };
    });
    return result;
  }

  async getOrderOfUser(userId: number) {
    return this.orderRepository.getListOrderOfUser(userId);
  }

  async createOrderFromCart(userId: number, dto: CreateOrderDto) {
    const cartItems = await this.cartItemRepository.getAll({
      where: { id: In(dto.cart_items_ids) },
      relations: ["product", "product.flash_sale_item", "product.flash_sale_item.flash_sale"],
    });

    return await this.executeTransaction(async (queryRunner) => {
      const orderItems = cartItems.map((item) => {
        const orderItem = new OrderItemEntity();
        orderItem.product_id = item.product.id;
        orderItem.product_name = item.product.name;
        orderItem.quantity = item.quantity;

        // Check if there is an active flash sale for this product
        const now = new Date();
        const flashSaleItem = item.product.flash_sale_item;
        const flashSale = flashSaleItem?.flash_sale;
        const isFlashSaleActive =
          flashSaleItem &&
          flashSale &&
          flashSale.is_active &&
          new Date(flashSale.start_time) <= now &&
          new Date(flashSale.end_time) >= now;

        if (isFlashSaleActive) {
          if (flashSaleItem.quantity < item.quantity) {
            throw new BadRequestException(
              `Sản phẩm ${item.product.name} trong Flash Sale chỉ còn ${flashSaleItem.quantity} sản phẩm.`,
            );
          }
          orderItem.price = flashSaleItem.price;
        } else {
          orderItem.price = item.price_at_time;
        }

        return orderItem;
      });

      const order = new OrderEntity();
      order.user_id = userId;
      order.address = dto.address;
      order.phone = dto.phone;
      order.payment_method = dto.payment_method;
      order.shipping_fee = await this.calculateShippingFee(dto.address);
      order.total_amount = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        order.shipping_fee,
      );

      if (order.payment_method === EPaymentMethod.ONLINE_BANKING) {
        const code = uuid.v4();
        order.status = EOrderStatus.PENDING;
        order.unique_code = code;
        order.online_bank_url = await this.onlineBankingService.createOnlineBankingUrl(
          {
            code: code,
            amount: order.total_amount + order.shipping_fee,
            order_info: "",
          },
          EQRType.ORDER_PAYMENT,
        );
      }

      for (const item of orderItems) {
        const product = await this.productRepository.getOneByIdOrFail(item.product_id, {
          relations: ["flash_sale_item", "flash_sale_item.flash_sale"],
        });
        if (product.stock < item.quantity) {
          throw new BadRequestException(this.i18n.t("ORDER.INSUFFICIENT_STOCK"));
        }
        product.stock -= item.quantity;
        product.purchased += item.quantity;

        // Deduct flash sale stock if applicable
        const now = new Date();
        const flashSaleItem = product.flash_sale_item;
        const flashSale = flashSaleItem?.flash_sale;
        const isFlashSaleActive =
          flashSaleItem &&
          flashSale &&
          flashSale.is_active &&
          new Date(flashSale.start_time) <= now &&
          new Date(flashSale.end_time) >= now;

        if (isFlashSaleActive) {
          if (flashSaleItem.quantity < item.quantity) {
            throw new BadRequestException(
              `Sản phẩm ${product.name} trong Flash Sale chỉ còn ${flashSaleItem.quantity} sản phẩm.`,
            );
          }
          flashSaleItem.quantity -= item.quantity;
          await queryRunner.manager.save(flashSaleItem);
        }

        await this.productRepository.update({ where: { id: product.id } }, product, queryRunner);
      }

      if (order.payment_method === EPaymentMethod.COD) {
        order.status = EOrderStatus.PREPARING;
        order.payment_status = EPaymentStatus.UNPAID;
      }

      const newOrder = await this.orderRepository.create(order, queryRunner);
      await this.orderItemRepository.createMany(
        orderItems.map((item) => ({
          ...item,
          order_id: newOrder.id,
        })),
        queryRunner,
      );

      await this.cartItemRepository.remove(
        {
          where: { id: In(dto.cart_items_ids) },
        },
        queryRunner,
      );

      return {
        order_id: newOrder.id,
        message: this.i18n.t("ORDER.CREATE_SUCCESS"),
      };
    });
  }

  async calculateShippingFee(address: string) {
    const res = await this.apiClientService.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "jsonv2" },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      },
    });

    if (!res || res.length === 0) {
      throw new BadRequestException("Không tìm thấy địa chỉ, vui lòng thử lại.");
    }

    const lat = res[0].lat;
    const lng = res[0].lon;

    const distance = this.haversineDistance(STORE_LAT, STORE_LNG, Number(lat), Number(lng));

    return Math.max(MIN_SHIPPING_FEE, Math.round((distance * RATE_PER_KM) / 1000) * 1000);
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  async handleOnlineBankingPaymentResult(returnedParams: any) {
    const { vnp_TxnRef } = returnedParams;
    const order = await this.orderRepository.getOneOrFail({ where: { unique_code: vnp_TxnRef } });
    order.payment_status = EPaymentStatus.PAID;
    order.status = EOrderStatus.PREPARING;
    await this.orderRepository.update({ where: { id: order.id } }, order);
    return {
      success: true,
      message: this.i18n.t("PAYMENT.ONLINE_BANKING.SUCCESS"),
    };
  }

  async reGeneratePaymentUrl(orderId: number) {
    const order = await this.orderRepository.getOneOrFail({ where: { id: orderId } });
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.payment_method === EPaymentMethod.ONLINE_BANKING) {
      const code = uuid.v4();
      order.unique_code = code;
      order.online_bank_url = await this.onlineBankingService.createOnlineBankingUrl(
        {
          code: code,
          amount: order.total_amount + order.shipping_fee,
          order_info: "",
        },
        EQRType.ORDER_PAYMENT,
      );
    }

    await this.orderRepository.create(order);
    return {
      url: order.online_bank_url,
    };
  }

  async UpdateOrderReceiverInfo(
    user: CurrentUser,
    orderId: number,
    dto: UpdateOrderReceiverInfoDto,
  ) {
    const order = await this.orderRepository.getOneOrFail({ where: { id: orderId } });
    if (order.user_id !== user.id && user.role !== EUserRole.ADMIN) {
      throw new Error("You are not allowed to update this order");
    }

    order.phone = dto.phone;
    order.address = dto.address;

    await this.orderRepository.update({ where: { id: order.id } }, order);
    return {
      success: true,
      message: this.i18n.t("ORDER.UPDATE_SUCCESS"),
    };
  }

  async UpdateOrderStatus(orderId: number, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.getOneOrFail({ where: { id: orderId } });
    order.status = dto.status;
    await this.orderRepository.update({ where: { id: order.id } }, order);
    return {
      success: true,
      message: this.i18n.t("ORDER.UPDATE_SUCCESS"),
    };
  }
}
