import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export interface LambdasProps {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly productsTable: dynamodb.ITable;
  readonly usersTable: dynamodb.ITable;
  readonly ordersTable: dynamodb.ITable;
  readonly productBucket: s3.IBucket;
  readonly userBucket: s3.IBucket;
}

export class Lambdas extends Construct {
  public readonly productFunction: lambda.Function;
  public readonly userFunction: lambda.Function;
  public readonly orderFunction: lambda.Function;
  public readonly ordersDLQ: sqs.Queue;

  constructor(scope: Construct, id: string, props: LambdasProps) {
    super(scope, id);

    // Lambda Layer for common dependencies
    const commonLayer = new lambda.LayerVersion(this, 'CommonLayer', {
      code: lambda.Code.fromAsset('lambda/layers/nodejs'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      description: 'Common dependencies for e-commerce Lambda functions',
    });

    // Product Lambda Function
    this.productFunction = new lambda.Function(this, 'ProductFunction', {
      code: lambda.Code.fromAsset('lambda/functions/products'),
      environment: {
        NODE_ENV: 'production',
        PRODUCT_BUCKET: props.productBucket.bucketName,
        PRODUCTS_TABLE: props.productsTable.tableName,
      },
      handler: 'dist/index.handler',
      layers: [commonLayer],
      logRetention: logs.RetentionDays.ONE_WEEK,
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_18_X,
      securityGroups: [props.securityGroup],
      timeout: cdk.Duration.seconds(30),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // User Lambda Function
    this.userFunction = new lambda.Function(this, 'UserFunction', {
      code: lambda.Code.fromAsset('lambda/functions/users'),
      environment: {
        NODE_ENV: 'production',
        USER_BUCKET: props.userBucket.bucketName,
        USERS_TABLE: props.usersTable.tableName,
      },
      handler: 'dist/index.handler',
      layers: [commonLayer],
      logRetention: logs.RetentionDays.ONE_WEEK,
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_18_X,
      securityGroups: [props.securityGroup],
      timeout: cdk.Duration.seconds(30),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // Orders Dead Letter Queue
    this.ordersDLQ = new sqs.Queue(this, 'OrdersDLQ', {
      queueName: 'orders-lambda-dlq',
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.KMS_MANAGED,
    });

    // Order Lambda Function
    this.orderFunction = new lambda.Function(this, 'OrderFunction', {
      code: lambda.Code.fromAsset('lambda/functions/orders'),
      deadLetterQueue: this.ordersDLQ,
      deadLetterQueueEnabled: true,
      retryAttempts: 2,
      environment: {
        LOG_LEVEL: 'INFO',
        NODE_OPTIONS: '--enable-source-maps',
        NODE_ENV: 'production',
        ORDERS_TABLE: props.ordersTable.tableName,
        PRODUCTS_TABLE: props.productsTable.tableName,
        USERS_TABLE: props.usersTable.tableName,
      },
      handler: 'dist/index.handler',
      layers: [commonLayer],
      logRetention: logs.RetentionDays.ONE_WEEK,
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_18_X,
      securityGroups: [props.securityGroup],
      timeout: cdk.Duration.seconds(30),
      tracing: lambda.Tracing.ACTIVE,
      reservedConcurrentExecutions: 100,
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    // Grant DynamoDB permissions
    props.productsTable.grantReadWriteData(this.productFunction);
    props.usersTable.grantReadWriteData(this.userFunction);
    props.ordersTable.grantReadWriteData(this.orderFunction);
    props.productsTable.grantReadData(this.orderFunction); // Orders need to read products
    props.usersTable.grantReadData(this.orderFunction); // Orders need to read users

    // Grant S3 permissions
    props.productBucket.grantReadWrite(this.productFunction);
    props.userBucket.grantReadWrite(this.userFunction);
  }
}
