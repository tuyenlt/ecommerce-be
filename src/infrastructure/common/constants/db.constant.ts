export enum ETableName {
  USER = "users",
  PRODUCT = "products",
  CATEGORY = "categories",
  RATING = "ratings",
  ORDER_ITEMS = "order_items",
  ORDER = "orders",
  CART = "carts",
  CART_ITEM = "cart_items",
  PRODUCT_VECTOR = "product_vectors",
  BANNER = "banners",
  CONTACT_MESSAGE = "contact_messages",
  FLASH_SALE = "flash_sales",
  FLASH_SALE_ITEM = "flash_sale_items",
}

export enum EUserRole {
  USER = 0,
  ADMIN = 1,
}

export enum EOrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  SHIPPED = "shipped",
  CANCELLED = "cancelled",
}

export enum EPaymentMethod {
  COD = "cod",
  ONLINE_BANKING = "online_banking",
}

export enum EPaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  FAILED = "failed",
}

export enum EContactMessageType {
  CUSTOMER_TO_ADMIN = "customer_to_admin",
  ADMIN_TO_CUSTOMER = "admin_to_customer",
}

export const EMAIL_MAX_LENGTH = 255;
export const PHONE_MAX_LENGTH = 20;
export const NAME_MAX_LENGTH = 255;
