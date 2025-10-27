// Order Zod schemas - shared across all applications
// Types are imported from root-schema (generated from GraphQL)

import {
  Order,
  OrderItem,
  OrdersData,
  OrderStatus,
} from '@speira/e-commerce-schema';
import { z } from 'zod';

export type { Order, OrderItem, OrdersData };

export { OrderStatus };
export type OrderStatusType = OrderStatus;

export const OrderStatusSchema = z.enum(OrderStatus);

export const OrderItemSchema = z.object({
  productId: z.uuid('Product ID must be a valid UUID'),
  product: z.any().optional().nullable(),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  price: z.number().nonnegative('Price must be non-negative'),
  total: z.number().nonnegative('Total must be non-negative'),
});

export const OrderSchema = z.object({
  id: z.uuid('Order ID must be a valid UUID'),
  idempotencyKey: z.uuid('Idempotency key must be a valid UUID'),
  userId: z.uuid('User ID must be a valid UUID'),
  user: z.any().optional().nullable(),
  status: OrderStatusSchema,
  total: z.number().nonnegative('Total must be non-negative'),
  shippingAddress: z.string().min(1, 'Shipping address is required').max(500),
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item'),
  createdAt: z.string().datetime('Created date must be ISO 8601 datetime'),
  updatedAt: z.string().datetime('Updated date must be ISO 8601 datetime'),
});

/** OrdersData schema for paginated/listed results */
export const OrdersDataSchema = z.object({
  items: z.array(OrderSchema),
  total: z.number().int().nonnegative('Total must be a non-negative integer'),
  nextToken: z.string().optional().nullable(),
});

export const parseOrder = (data: unknown) => OrderSchema.parse(data);
export const parseOrderItem = (data: unknown) => OrderItemSchema.parse(data);
export const parseOrdersData = (data: unknown) => OrdersDataSchema.parse(data);

export function checkIsOrder(data: unknown): data is Order {
  return OrderSchema.safeParse(data).success;
}
export function checkIsOrderItem(data: unknown): data is OrderItem {
  return OrderItemSchema.safeParse(data).success;
}
export function checkIsOrdersData(data: unknown): data is OrdersData {
  return OrdersDataSchema.safeParse(data).success;
}
export function checkIsOrderStatus(data: unknown): data is OrderStatus {
  return OrderStatusSchema.safeParse(data).success;
}
