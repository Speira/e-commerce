import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppSyncApi } from './constructs/appsync';
import { CognitoAuth } from './constructs/cognito';
import { Database } from './constructs/database';
import { Lambdas } from './constructs/lambdas';
import { Monitoring } from './constructs/monitoring';
import { Networking } from './constructs/networking';
import { Security } from './constructs/security';
import { Storage } from './constructs/storage';

export interface EcommerceInfrastructureStackProps extends cdk.StackProps {
  // Add custom props if needed
}

export class EcommerceInfrastructureStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: EcommerceInfrastructureStackProps,
  ) {
    super(scope, id, props);

    // Networking - VPC and Security Groups
    const networking = new Networking(this, 'Networking', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Database - DynamoDB Tables
    const database = new Database(this, 'Database', {
      stackName: this.stackName,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Set to RETAIN for production
    });

    // Storage - S3 Buckets
    const storage = new Storage(this, 'Storage', {
      stackName: this.stackName,
      account: this.account,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Set to RETAIN for production
      autoDeleteObjects: true, // Set to false for production
    });

    // Lambda Functions
    const lambdas = new Lambdas(this, 'Lambdas', {
      vpc: networking.vpc,
      securityGroup: networking.lambdaSecurityGroup,
      productsTable: database.productsTable,
      usersTable: database.usersTable,
      ordersTable: database.ordersTable,
      productBucket: storage.productBucket,
      userBucket: storage.userBucket,
    });

    // Cognito Authentication
    // To enable Google sign-in, set these environment variables:
    // - GOOGLE_CLIENT_ID: Your Google OAuth client ID
    // - GOOGLE_CLIENT_SECRET: Your Google OAuth client secret
    const cognito = new CognitoAuth(this, 'Cognito', {
      stackName: this.stackName,
      callbackUrls: [
        'http://localhost:3000/auth/callback',
        'http://localhost:5173/auth/callback', // Vite admin UI
        // Add your production URLs here when deploying
      ],
      logoutUrls: [
        'http://localhost:3000',
        'http://localhost:5173',
        // Add your production URLs here when deploying
      ],
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    // AppSync GraphQL API with Cognito authentication
    const appSyncApi = new AppSyncApi(this, 'AppSync', {
      productFunction: lambdas.productFunction,
      userFunction: lambdas.userFunction,
      orderFunction: lambdas.orderFunction,
      userPool: cognito.userPool,
    });

    // Security - WAF
    new Security(this, 'Security');

    // Monitoring - CloudWatch and Alarms
    new Monitoring(this, 'Monitoring', {
      orderFunction: lambdas.orderFunction,
    });

    // Outputs
    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: appSyncApi.graphqlApi.graphqlUrl,
      description: 'AppSync GraphQL API URL',
      exportName: `${this.stackName}-graphql-url`,
    });

    new cdk.CfnOutput(this, 'GraphQLApiKey', {
      value: appSyncApi.graphqlApi.apiKey || 'No API Key',
      description: 'AppSync GraphQL API Key',
      exportName: `${this.stackName}-graphql-key`,
    });

    new cdk.CfnOutput(this, 'ProductBucketName', {
      value: storage.productBucket.bucketName,
      description: 'Product S3 bucket name',
      exportName: `${this.stackName}-product-bucket`,
    });

    new cdk.CfnOutput(this, 'UserBucketName', {
      value: storage.userBucket.bucketName,
      description: 'User S3 bucket name',
      exportName: `${this.stackName}-user-bucket`,
    });

    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: database.productsTable.tableName,
      description: 'DynamoDB Products table name',
      exportName: `${this.stackName}-products-table`,
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: database.usersTable.tableName,
      description: 'DynamoDB Users table name',
      exportName: `${this.stackName}-users-table`,
    });

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: database.ordersTable.tableName,
      description: 'DynamoDB Orders table name',
      exportName: `${this.stackName}-orders-table`,
    });

    new cdk.CfnOutput(this, 'OrdersDLQName', {
      value: lambdas.ordersDLQ.queueName,
      description: 'SQS Orders DLQ name',
      exportName: `${this.stackName}-orders-dlq`,
    });
  }
}
