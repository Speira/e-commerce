import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';
import type { UpdateItemOptions } from '../types';

export async function updateItem<T = unknown>(
  tableName: string,
  key: Record<string, unknown>,
  updateExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, unknown>,
  options?: UpdateItemOptions,
): Promise<T | null> {
  try {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: options?.conditionExpression,
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return (response.Attributes as T) || null;
  } catch (error) {
    throw databaseError('Error updating item in DynamoDB:', error);
  }
}
