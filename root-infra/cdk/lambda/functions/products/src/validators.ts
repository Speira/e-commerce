import { z } from 'zod';

export type OperationParams = Record<string, unknown>;

/** Product ID schema */
export const productIdSchema = z
  .string()
  .min(1, { message: 'Product ID is required' })
  .max(100, { message: 'Product ID too long' });

export type ProductId = z.infer<typeof productIdSchema>;

/** Create product input schema */
export const createProductInputSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Product name is required' })
    .max(255, { message: 'Product name too long' })
    .trim(),
  description: z
    .string()
    .max(1000, { message: 'Description too long' })
    .optional(),
  price: z
    .number()
    .min(0, { message: 'Price must be non-negative' })
    .max(1000000, { message: 'Price too high' }),
  stock: z
    .number()
    .int({ message: 'Stock must be an integer' })
    .min(0, { message: 'Stock must be non-negative' })
    .max(1000000, { message: 'Stock quantity too high' }),
  category: z
    .string()
    .max(100, { message: 'Category name too long' })
    .optional(),
  imageUrl: z
    .url({ message: 'Image URL must be valid' })
    .max(500, { message: 'Image URL too long' })
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

/** Update product input schema */
export const updateProductInputSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Product name is required' })
    .max(255, { message: 'Product name too long' })
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, { message: 'Description too long' })
    .optional(),
  price: z
    .number()
    .min(0, { message: 'Price must be non-negative' })
    .max(1000000, { message: 'Price too high' })
    .optional(),
  stock: z
    .number()
    .int({ message: 'Stock must be an integer' })
    .min(0, { message: 'Stock must be non-negative' })
    .max(1000000, { message: 'Stock quantity too high' })
    .optional(),
  category: z
    .string()
    .max(100, { message: 'Category name too long' })
    .optional(),
  imageUrl: z
    .url({ message: 'Image URL must be valid' })
    .max(500, { message: 'Image URL too long' })
    .optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

/** Product limit schema */
export const productLimitSchema = z
  .number()
  .min(1, { message: 'Limit must be at least 1' })
  .max(100, { message: 'Limit cannot exceed 100' })
  .optional();

export type ProductLimit = z.infer<typeof productLimitSchema>;

/** Pagination token schema */
export const paginationTokenSchema = z.string().optional();

export type PaginationToken = z.infer<typeof paginationTokenSchema>;
