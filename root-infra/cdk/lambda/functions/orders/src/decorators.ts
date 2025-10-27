import { Order } from '@speira/e-commerce-schema';

import { NodejsLayer } from '~/lambda/layers/nodejs';

const { error, repositories } = NodejsLayer;
const { usersRepository } = repositories;

/** Decorator to decorate order with user details */
export async function withUser(order: Order): Promise<Order> {
  try {
    const user = await usersRepository.getOneById(order.userId);
    const enrichedOrder = {
      ...order,
      user: user
        ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            ...(user.phone && { phone: user.phone }),
            ...(user.address && { address: user.address }),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        : null,
    };

    return enrichedOrder;
  } catch (err) {
    throw error.databaseError('Error enriching order:', err as Error);
  }
}
