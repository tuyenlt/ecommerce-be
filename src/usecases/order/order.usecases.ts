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
import { ForbiddenException } from "@nestjs/common";
export class OrderUsecases extends BaseUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly onlineBankingService: IOnlineBankingService,
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
      relations: ["product"],
    });

    return await this.executeTransaction(async (queryRunner) => {
      const orderItems = cartItems.map((item) => {
        const orderItem = new OrderItemEntity();
        orderItem.product_id = item.product_id;
        orderItem.quantity = item.quantity;
        orderItem.price = item.price_at_time;
        orderItem.product_id = item.product.id;
        orderItem.product_name = item.product.name;
        orderItem.quantity = item.quantity;
        return orderItem;
      });

      const order = new OrderEntity();
      order.user_id = userId;
      order.address = dto.address;
      order.phone = dto.phone;
      order.payment_method = dto.payment_method;
      order.total_amount = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
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
