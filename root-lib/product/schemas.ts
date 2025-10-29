// Product Zod schemas - shared across all applications
// Types are imported from root-schema (generated from GraphQL)

import type { Product, ProductsData } from '@speira/e-commerce-schema';
import { z } from 'zod';

export type { Product, ProductsData };

export const ProductSchema = z.object({
  id: z.uuid('Product ID must be a valid UUID'),
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().nonnegative('Price must be non-negative'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  category: z.string().max(100).optional().nullable(),
  imageUrl: z.url('Image URL must be valid').optional().nullable(),
  createdAt: z.iso.datetime('Created date must be ISO 8601 datetime'),
  updatedAt: z.iso.datetime('Updated date must be ISO 8601 datetime'),
});

export const ProductsDataSchema = z.object({
  items: z.array(ProductSchema),
  total: z.number().int().nonnegative('Total must be a non-negative integer'),
  nextToken: z.string().optional().nullable(),
});

export const parseProduct = (data: unknown) => ProductSchema.parse(data);
export const parseProductsData = (data: unknown) =>
  ProductsDataSchema.parse(data);

export function checkIsProduct(data: unknown): data is Product {
  return ProductSchema.safeParse(data).success;
}
export function checkIsProductsData(data: unknown): data is ProductsData {
  return ProductsDataSchema.safeParse(data).success;
}
