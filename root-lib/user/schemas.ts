// User Zod schemas - shared across all applications
// Types are imported from root-schema (generated from GraphQL)

import { User, UserRole, UsersData } from '@speira/e-commerce-schema';
import { z } from 'zod';

export type { User, UsersData };

export const UserRoleSchema = z.enum(UserRole);

export const UserSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
  email: z.string().email('Email must be valid'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: UserRoleSchema,
  phone: z.string().max(20).optional().nullable(),
  isActive: z.boolean(),
  address: z.string().max(500).optional().nullable(),
  createdAt: z.string().datetime('Created date must be ISO 8601 datetime'),
  updatedAt: z.string().datetime('Updated date must be ISO 8601 datetime'),
});

export const UsersDataSchema = z.object({
  items: z.array(UserSchema),
  total: z.number().int().nonnegative('Total must be a non-negative integer'),
  nextToken: z.string().optional().nullable(),
});

/** Validation helpers for backward compatibility */
export const validateUser = (data: unknown) => UserSchema.safeParse(data);
export const parseUser = (data: unknown) => UserSchema.parse(data);
export const validateUsersData = (data: unknown) =>
  UsersDataSchema.safeParse(data);
export const parseUsersData = (data: unknown) => UsersDataSchema.parse(data);

export function checkIsUser(data: unknown): data is User {
  return UserSchema.safeParse(data).success;
}

export function checkIsUsersData(data: unknown): data is UsersData {
  return UsersDataSchema.safeParse(data).success;
}

export function checkIsUserRole(data: unknown): data is UserRole {
  return UserRoleSchema.safeParse(data).success;
}
