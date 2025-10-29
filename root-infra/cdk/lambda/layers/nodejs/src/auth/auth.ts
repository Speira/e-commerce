import { GraphQLEvent, UserRole } from '@speira/e-commerce-schema';

import { forbidden, unauthorized } from '../error';

/** Auth context to pass through operations */
export interface AuthContext {
  userId: string;
  userRole?: UserRole;
  isAdmin: boolean;
  isManager: boolean;
}

/** Extract auth context from GraphQL event */
export function getAuthContext(event: GraphQLEvent): AuthContext {
  const userId = event.identity?.sub;
  if (!userId) {
    throw unauthorized('Authentication required');
  }

  // Role can be in claims or groups
  const role =
    (event.identity?.claims?.['custom:role'] as UserRole) ||
    (event.identity?.claims?.['cognito:groups']?.[0] as UserRole);

  const isAdmin = role === UserRole.ADMIN;
  const isManager = role === UserRole.MANAGER || isAdmin;

  return {
    userId,
    userRole: role,
    isAdmin,
    isManager,
  };
}

/** Require authentication */
export function requireAuth(event: GraphQLEvent): AuthContext {
  return getAuthContext(event);
}

/** Require admin role */
export function requireAdmin(context: AuthContext): void {
  if (!context.isAdmin) {
    throw forbidden('Admin access required');
  }
}

/** Require manager or admin role */
export function requireManager(context: AuthContext): void {
  if (!context.isManager) {
    throw forbidden('Manager or Admin access required');
  }
}

/** Check if user owns the resource, (unless admin) */
export function requireOwnership(
  resourceUserId: string,
  context: AuthContext,
): void {
  if (context.userId !== resourceUserId && !context.isAdmin) {
    throw forbidden('You can only access your own resources');
  }
}

/** Check if user can access the resource, (unless admin) */
export function requireResourceAccess(
  userId: string,
  context: AuthContext,
): void {
  requireOwnership(userId, context);
}

/** Check if user can modify the resource, (unless admin) */
export function requireResourceModification(
  userId: string,
  context: AuthContext,
): void {
  // Only admins and managers can modify orders, or the owner can cancel
  if (!context.isManager && context.userId !== userId) {
    throw forbidden(
      'Only admins, managers, or resource owners can modify the resource',
    );
  }
}
