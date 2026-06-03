import { Injectable } from "@nestjs/common";
import { BaseUseCases } from "../base.usecases";
import { DataSource } from "typeorm";
import { IOrderRepository } from "src/domain/repositories/order-repository.interface";
import { IProductRepository } from "src/domain/repositories/product-repository.interface";
import { IOrderItemRepository } from "src/domain/repositories/order-item-repository.interface";
import { EOrderStatus } from "src/infrastructure/common/constants/db.constant";

@Injectable()
export class StatUsecases extends BaseUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly productRepository: IProductRepository,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getRevenueByMonth(year?: number) {
    const currentYear = year || new Date().getFullYear();
    const result = await this.orderRepository.query(
      `
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        SUM(total_amount) as revenue,
        COUNT(*) as order_count
      FROM orders
      WHERE EXTRACT(YEAR FROM created_at) = $1 
        AND status IN ($2, $3, $4)
        AND deleted_at IS NULL
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY month ASC
    `,
      [currentYear, EOrderStatus.PREPARING, EOrderStatus.SHIPPED, EOrderStatus.PENDING],
    );

    return result.map((item) => ({
      month: parseInt(item.month),
      revenue: parseFloat(item.revenue) || 0,
      order_count: parseInt(item.order_count),
    }));
  }

  async getOrdersByMonth(year?: number) {
    const currentYear = year || new Date().getFullYear();
    const result = await this.orderRepository.query(
      `
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = $2 THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = $3 THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN payment_status = $4 THEN 1 ELSE 0 END) as unpaid_orders
      FROM orders
      WHERE EXTRACT(YEAR FROM created_at) = $1 AND deleted_at IS NULL
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY month ASC
    `,
      [currentYear, EOrderStatus.SHIPPED, EOrderStatus.CANCELLED, "unpaid"],
    );

    return result.map((item) => ({
      month: parseInt(item.month),
      total_orders: parseInt(item.total_orders),
      completed_orders: parseInt(item.completed_orders),
      cancelled_orders: parseInt(item.cancelled_orders),
      unpaid_orders: parseInt(item.unpaid_orders),
    }));
  }

  async getTopSellingProductsByMonth(year?: number, month?: number, limit: number = 10) {
    const currentDate = new Date();
    const queryYear = year || currentDate.getFullYear();
    const queryMonth = month || currentDate.getMonth() + 1;

    const result = await this.orderItemRepository.query(
      `
      SELECT 
        oi.product_id,
        oi.product_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.price * oi.quantity) as total_revenue,
        COUNT(DISTINCT oi.order_id) as times_sold,
        p.images as product_images
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      INNER JOIN products p ON p.id = oi.product_id
      WHERE EXTRACT(YEAR FROM o.created_at) <= $1 
        AND EXTRACT(MONTH FROM o.created_at) <= $2
        AND o.status IN ($3, $4, $5)
        AND oi.deleted_at IS NULL
        AND o.deleted_at IS NULL
      GROUP BY oi.product_id, oi.product_name, p.images
      ORDER BY total_quantity DESC
      LIMIT $6
    `,
      [
        queryYear,
        queryMonth,
        EOrderStatus.PREPARING,
        EOrderStatus.SHIPPED,
        EOrderStatus.PENDING,
        limit,
      ],
    );

    return result.map((item) => ({
      product_id: parseInt(item.product_id),
      product_name: item.product_name,
      product_images: item.product_images ? JSON.parse(item.product_images) : [],
      total_quantity: parseInt(item.total_quantity),
      total_revenue: parseFloat(item.total_revenue) || 0,
      times_sold: parseInt(item.times_sold),
    }));
  }

  async getTotalProducts() {
    const result = await this.productRepository.query(`
      SELECT COUNT(*) as total
      FROM products
      WHERE deleted_at IS NULL
    `);

    return {
      total_products: parseInt(result[0].total),
    };
  }

  async getDashboardStats(year?: number) {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [revenue, orders, topProducts, totalProducts] = await Promise.all([
      this.getRevenueByMonth(currentYear),
      this.getOrdersByMonth(currentYear),
      this.getTopSellingProductsByMonth(currentYear, currentMonth),
      this.getTotalProducts(),
    ]);

    const currentMonthRevenue = revenue.find((r) => r.month === currentMonth);
    const currentMonthOrders = orders.find((o) => o.month === currentMonth);

    return {
      summary: {
        total_products: totalProducts.total_products,
        current_month_revenue: currentMonthRevenue?.revenue || 0,
        current_month_orders: currentMonthOrders?.total_orders || 0,
      },
      revenue_by_month: revenue,
      orders_by_month: orders,
      top_selling_products: topProducts,
    };
  }
}
