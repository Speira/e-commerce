import { z } from 'zod';

export type OperationParams = Record<string, unknown>;

/** Create order input schema */
export const createOrderInputSchema = z.object({
  idempotencyKey: z.uuid({ message: 'Idempotency key must be a valid UUID' }),
  userId: z
    .string()
    .min(1, { message: 'User ID is required' })
    .max(100, { message: 'User ID too long' }),
  items: z
    .array(
      z.object({
        productId: z
          .string()
          .min(1, { message: 'Product ID is required' })
          .max(100, { message: 'Product ID too long' }),
        quantity: z
          .number()
          .int({ message: 'Quantity must be an integer' })
          .min(1, { message: 'Quantity must be at least 1' })
          .max(1000, { message: 'Quantity cannot exceed 1000 per item' }),
      }),
    )
    .min(1, { message: 'At least one item is required' })
    .max(100, { message: 'Cannot order more than 100 different items' }),
  shippingAddress: z
    .string()
    .min(10, { message: 'Shipping address is too short' })
    .max(500, { message: 'Shipping address is too long' })
    .regex(/^[a-zA-Z0-9\s,.\-#/]+$/, {
      message: 'Shipping address contains invalid characters',
    })
    .trim(),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

/** Order ID schema */
export const orderIdSchema = z
  .string()
  .nonempty({ message: 'Order ID is required' });

export type OrderId = z.infer<typeof orderIdSchema>;

/** User ID schema */
export const userIdSchema = z
  .string()
  .nonempty({ message: 'User ID is required' });

export type UserId = z.infer<typeof userIdSchema>;

/** Order limit schema */
export const orderLimitSchema = z
  .number()
  .min(1, { message: 'Limit must be at least 1 when provided' })
  .max(100, { message: 'Limit cannot exceed 100' })
  .optional();

export type OrderLimit = z.infer<typeof orderLimitSchema>;

/** Pagination token schema */
export const paginationTokenSchema = z.string().optional();

export type PaginationToken = z.infer<typeof paginationTokenSchema>;

/** Order input schema */
export const orderInputSchema = z.object({
  id: orderIdSchema,
  input: createOrderInputSchema,
});

export type OrderInput = z.infer<typeof orderInputSchema>;
