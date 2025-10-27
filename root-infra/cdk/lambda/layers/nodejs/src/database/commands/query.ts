import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';
import type { PaginatedResult, QueryOptions } from '../types';

export async function queryItems<T = unknown>(
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, unknown>,
  options?: QueryOptions,
): Promise<T[]> {
  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      IndexName: options?.indexName,
      FilterExpression: options?.filterExpression,
      Limit: options?.limit,
      ScanIndexForward: options?.scanIndexForward,
      ExclusiveStartKey: options?.exclusiveStartKey,
    });

    const response = await docClient.send(command);
    return (response.Items as T[]) || [];
  } catch (error) {
    throw databaseError('Error querying items from DynamoDB:', error);
  }
}

export async function queryItemsPaginated<T = unknown>(
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, unknown>,
  options?: QueryOptions,
): Promise<PaginatedResult<T>> {
  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      IndexName: options?.indexName,
      FilterExpression: options?.filterExpression,
      Limit: options?.limit,
      ScanIndexForward: options?.scanIndexForward,
      ExclusiveStartKey: options?.exclusiveStartKey,
    });

    const response = await docClient.send(command);
    return {
      items: (response.Items as T[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey || {},
    };
  } catch (error) {
    throw databaseError('Error querying items paginated from DynamoDB:', error);
  }
}
