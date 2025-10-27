import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface DatabaseProps {
  readonly stackName: string;
  readonly removalPolicy?: cdk.RemovalPolicy;
}

export class Database extends Construct {
  public readonly productsTable: dynamodb.Table;
  public readonly usersTable: dynamodb.Table;
  public readonly ordersTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    const removalPolicy = props.removalPolicy ?? cdk.RemovalPolicy.DESTROY;

    // Products Table
    this.productsTable = new dynamodb.Table(this, 'ProductsTable', {
      tableName: `${props.stackName.toLowerCase()}-products`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Pay per request for cost optimization
      removalPolicy: removalPolicy, // Set to RETAIN for production
      pointInTimeRecovery: true, // Enable point-in-time recovery
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'ttl', // For cache expiration
    });

    // Products by category
    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'price', type: dynamodb.AttributeType.NUMBER },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Users Table
    this.usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: `${props.stackName.toLowerCase()}-users`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: removalPolicy,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'ttl',
    });

    // Users by email
    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Users by role
    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'RoleIndex',
      partitionKey: { name: 'role', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Orders Table
    this.ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: `${props.stackName.toLowerCase()}-orders`,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      pointInTimeRecovery: true,
      removalPolicy: removalPolicy,
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING }, // For sorting orders by date
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES, // Optional: for audit trail
      timeToLiveAttribute: 'ttl',
    });

    // Orders by user
    this.ordersTable.addGlobalSecondaryIndex({
      indexName: 'UserIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Orders by idempotency key
    this.ordersTable.addGlobalSecondaryIndex({
      indexName: 'IdempotencyIndex',
      partitionKey: {
        name: 'idempotencyKey',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
