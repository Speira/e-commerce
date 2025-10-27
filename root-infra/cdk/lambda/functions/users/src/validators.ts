import { z } from 'zod';

import { UserRole } from '@speira/e-commerce-schema';

export type OperationParams = Record<string, unknown>;

/** User ID schema */
export const userIdSchema = z
  .string()
  .min(1, { message: 'User ID is required' })
  .max(100, { message: 'User ID too long' });

export type UserId = z.infer<typeof userIdSchema>;

/** Email schema with validation */
export const emailSchema = z
  .email({ message: 'Invalid email format' })
  .min(5, { message: 'Email too short' })
  .max(255, { message: 'Email too long' })
  .toLowerCase()
  .trim();

/** Phone number schema with validation */
export const phoneSchema = z
  .string()
  .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
    message: 'Invalid phone number format',
  })
  .min(10, { message: 'Phone number too short' })
  .max(20, { message: 'Phone number too long' })
  .optional();

/** Address schema with validation */
export const addressSchema = z
  .string()
  .min(10, { message: 'Address too short' })
  .max(500, { message: 'Address too long' })
  .regex(/^[a-zA-Z0-9\s,.\-#/]+$/, {
    message: 'Address contains invalid characters',
  })
  .trim()
  .optional();

/** Name schema (for first/last names) */
export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .max(100, { message: 'Name too long' })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  })
  .trim();

/** Create user input schema */
export const createUserInputSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.nativeEnum(UserRole),
  phone: phoneSchema,
  address: addressSchema,
  isActive: z.boolean().default(true),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

/** Update user input schema */
export const updateUserInputSchema = z.object({
  email: emailSchema.optional(),
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  role: z.enum(UserRole).optional(),
  phone: phoneSchema,
  address: addressSchema,
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

/** User limit schema */
export const userLimitSchema = z
  .number()
  .min(1, { message: 'Limit must be at least 1' })
  .max(100, { message: 'Limit cannot exceed 100' })
  .optional();

export type UserLimit = z.infer<typeof userLimitSchema>;

/** Pagination token schema */
export const paginationTokenSchema = z.string().optional();

export type PaginationToken = z.infer<typeof paginationTokenSchema>;

/** User role filter schema */
export const userRoleSchema = z.enum(UserRole).optional();

export type UserRoleFilter = z.infer<typeof userRoleSchema>;
