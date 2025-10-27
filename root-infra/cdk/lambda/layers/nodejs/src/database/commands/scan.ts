import { ScanCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';
import type { PaginatedResult, QueryOptions } from '../types';

export async function scanItems<T = unknown>(
  tableName: string,
  options?: QueryOptions,
): Promise<T[]> {
  try {
    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: options?.filterExpression,
      ExpressionAttributeNames: options?.expressionAttributeNames,
      ExpressionAttributeValues: options?.expressionAttributeValues,
      Limit: options?.limit,
      ExclusiveStartKey: options?.exclusiveStartKey,
    });

    const response = await docClient.send(command);
    return (response.Items as T[]) || [];
  } catch (error) {
    throw databaseError('Error scanning items from DynamoDB:', error);
  }
}

export async function scanItemsPaginated<T = unknown>(
  tableName: string,
  options?: QueryOptions,
): Promise<PaginatedResult<T>> {
  try {
    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: options?.filterExpression,
      ExpressionAttributeNames: options?.expressionAttributeNames,
      ExpressionAttributeValues: options?.expressionAttributeValues,
      Limit: options?.limit,
      ExclusiveStartKey: options?.exclusiveStartKey,
    });

    const response = await docClient.send(command);
    return {
      items: (response.Items as T[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey || {},
    };
  } catch (error) {
    throw databaseError('Error scanning items paginated from DynamoDB:', error);
  }
}
