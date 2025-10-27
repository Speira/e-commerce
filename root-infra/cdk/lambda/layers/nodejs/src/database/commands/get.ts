import { BatchGetCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';

export async function getItem<T = unknown>(
  tableName: string,
  key: Record<string, unknown>,
): Promise<T | null> {
  try {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });

    const response = await docClient.send(command);
    return (response.Item as T) || null;
  } catch (error) {
    throw databaseError('Error getting item from DynamoDB:', error);
  }
}

/**
 * Batch get items from DynamoDB as it has a limit of 100 items per batch
 * request. So we need to chunk the keys into smaller batches.
 */
export async function batchGetItems<T = unknown>(
  tableName: string,
  keys: Record<string, unknown>[],
): Promise<T[]> {
  if (keys.length === 0) return [];
  const BATCH_SIZE = 100;
  try {
    const results: T[] = [];
    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const chunk = keys.slice(i, i + BATCH_SIZE);
      const command = new BatchGetCommand({
        RequestItems: {
          [tableName]: { Keys: chunk },
        },
      });

      const response = await docClient.send(command);
      const items = response.Responses?.[tableName] as T[];
      if (items) {
        results.push(...items);
      }
    }

    return results;
  } catch (error) {
    throw databaseError('Error batch getting items from DynamoDB:', error);
  }
}
