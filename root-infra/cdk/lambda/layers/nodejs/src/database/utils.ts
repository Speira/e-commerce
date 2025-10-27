import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

/**
 * Add TTL to an item to be able to delete the item after a certain amount of
 * time. It can be used in combination with the `deleteItem`. Usefull to avoid
 * having to delete the item manually.
 */
export function addTTL<T extends Record<string, unknown>>(
  item: T,
  days: number,
): T & { ttl: number } {
  const ttl = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60; // seconds since epoch
  return { ...item, ttl };
}
