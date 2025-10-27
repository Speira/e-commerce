import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import { databaseError } from '../../error';
import { docClient } from '../client';

/** Execute a transaction with multiple writes */
export async function executeTransaction(
  transactItems: Array<{
    Put?: {
      TableName: string;
      Item: Record<string, unknown>;
      ConditionExpression?: string;
      ExpressionAttributeNames?: Record<string, string>;
      ExpressionAttributeValues?: Record<string, unknown>;
    };
    Update?: {
      TableName: string;
      Key: Record<string, unknown>;
      UpdateExpression: string;
      ConditionExpression?: string;
      ExpressionAttributeNames?: Record<string, string>;
      ExpressionAttributeValues?: Record<string, unknown>;
    };
    Delete?: {
      TableName: string;
      Key: Record<string, unknown>;
      ConditionExpression?: string;
      ExpressionAttributeNames?: Record<string, string>;
      ExpressionAttributeValues?: Record<string, unknown>;
    };
  }>,
): Promise<void> {
  try {
    const command = new TransactWriteCommand({
      TransactItems: transactItems,
    });

    await docClient.send(command);
  } catch (error) {
    throw databaseError('Error executing transaction:', error);
  }
}
