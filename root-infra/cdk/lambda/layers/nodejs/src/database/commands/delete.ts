import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';

export async function deleteItem(
  tableName: string,
  key: Record<string, unknown>,
  conditionExpression?: string,
  expressionAttributeNames?: Record<string, string>,
  expressionAttributeValues?: Record<string, unknown>,
): Promise<void> {
  try {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
      ConditionExpression: conditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await docClient.send(command);
  } catch (error) {
    throw databaseError('Error deleting item from DynamoDB:', error);
  }
}
