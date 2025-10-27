import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';
import { PutItemOptions } from '../types';

export async function putItem<T extends Record<string, unknown>>(
  tableName: string,
  item: T,
  options?: PutItemOptions,
): Promise<void> {
  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: options?.conditionExpression,
      ExpressionAttributeNames: options?.expressionAttributeNames,
      ExpressionAttributeValues: options?.expressionAttributeValues,
    });

    await docClient.send(command);
  } catch (error) {
    throw databaseError('Error putting item to DynamoDB:', error);
  }
}
