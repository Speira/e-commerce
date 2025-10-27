import type { PlainObject } from '@speira/e-commerce-lib';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { EcommerceInfrastructureStack } from '~/stacks/ecommerce-infrastructure-stack';

type IAMPolicyStatement = PlainObject<
  PlainObject<PlainObject<{ Action: string[] }[]>>
>;

describe('EcommerceInfrastructureStack', () => {
  let stack: EcommerceInfrastructureStack;
  let template: Template;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new EcommerceInfrastructureStack(app, 'TestStack', {
      env: {
        account: '123456789012',
        region: 'eu-west-3',
      },
    });
    template = Template.fromStack(stack);
  });

  describe('VPC', () => {
    it('should create a VPC with correct configuration', () => {
      template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
      });
    });

    it('should create public and private subnets', () => {
      // Check for multiple subnets (public, private, database)
      const subnets = template.findResources('AWS::EC2::Subnet');
      expect(Object.keys(subnets).length).toBeGreaterThanOrEqual(4);

      // Check for public subnets
      template.hasResourceProperties('AWS::EC2::Subnet', {
        MapPublicIpOnLaunch: true,
        Tags: Match.arrayWith([
          {
            Key: 'aws-cdk:subnet-name',
            Value: 'Public',
          },
        ]),
      });

      // Check for private subnets (database subnets)
      template.hasResourceProperties('AWS::EC2::Subnet', {
        MapPublicIpOnLaunch: false,
        Tags: Match.arrayWith([
          {
            Key: 'aws-cdk:subnet-name',
            Value: 'Database',
          },
        ]),
      });
    });

    it('should create NAT Gateway for private subnets', () => {
      template.hasResource('AWS::EC2::NatGateway', {});
      template.hasResource('AWS::EC2::EIP', {});
    });
  });

  describe('DynamoDB Tables', () => {
    it('should create Products table with correct configuration', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: Match.stringLikeRegexp('.*products.*'),
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: Match.arrayWith([
          Match.objectLike({ AttributeName: 'id', AttributeType: 'S' }),
          Match.objectLike({ AttributeName: 'category', AttributeType: 'S' }),
          Match.objectLike({ AttributeName: 'price', AttributeType: 'N' }),
        ]),
        KeySchema: Match.arrayWith([
          Match.objectLike({ AttributeName: 'id', KeyType: 'HASH' }),
        ]),
        GlobalSecondaryIndexes: Match.arrayWith([
          Match.objectLike({
            IndexName: 'CategoryIndex',
            KeySchema: Match.arrayWith([
              Match.objectLike({ AttributeName: 'category', KeyType: 'HASH' }),
              Match.objectLike({ AttributeName: 'price', KeyType: 'RANGE' }),
            ]),
            Projection: { ProjectionType: 'ALL' },
          }),
        ]),
        PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
        SSESpecification: { SSEEnabled: true },
        TimeToLiveSpecification: Match.objectLike({
          AttributeName: 'ttl',
          Enabled: true,
        }),
      });
    });

    it('should create Users table with correct configuration', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: Match.stringLikeRegexp('.*users.*'),
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: Match.arrayWith([
          Match.objectLike({ AttributeName: 'id', AttributeType: 'S' }),
          Match.objectLike({ AttributeName: 'email', AttributeType: 'S' }),
          Match.objectLike({ AttributeName: 'role', AttributeType: 'S' }),
          Match.objectLike({ AttributeName: 'createdAt', AttributeType: 'S' }),
        ]),
        KeySchema: Match.arrayWith([
          Match.objectLike({ AttributeName: 'id', KeyType: 'HASH' }),
        ]),
        GlobalSecondaryIndexes: Match.arrayWith([
          Match.objectLike({
            IndexName: 'EmailIndex',
            KeySchema: Match.arrayWith([
              Match.objectLike({ AttributeName: 'email', KeyType: 'HASH' }),
            ]),
            Projection: { ProjectionType: 'ALL' },
          }),
          Match.objectLike({
            IndexName: 'RoleIndex',
            KeySchema: Match.arrayWith([
              Match.objectLike({ AttributeName: 'role', KeyType: 'HASH' }),
              Match.objectLike({
                AttributeName: 'createdAt',
                KeyType: 'RANGE',
              }),
            ]),
            Projection: { ProjectionType: 'ALL' },
          }),
        ]),
        PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
        SSESpecification: { SSEEnabled: true },
        TimeToLiveSpecification: Match.objectLike({
          AttributeName: 'ttl',
          Enabled: true,
        }),
      });
    });

    it('should create Orders table with correct configuration', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: Match.stringLikeRegexp('.*orders.*'),
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: Match.arrayWith([
          Match.objectLike({ AttributeName: 'id', AttributeType: 'S' }),
          Match.objectLike({ AttributeName: 'userId', AttributeType: 'S' }),
          Match.objectLike({
            AttributeName: 'idempotencyKey',
            AttributeType: 'S',
          }),
          Match.objectLike({ AttributeName: 'createdAt', AttributeType: 'S' }),
        ]),
        KeySchema: Match.arrayWith([
          Match.objectLike({ AttributeName: 'id', KeyType: 'HASH' }),
          Match.objectLike({ AttributeName: 'createdAt', KeyType: 'RANGE' }),
        ]),
        GlobalSecondaryIndexes: Match.arrayWith([
          Match.objectLike({
            IndexName: 'UserIndex',
            KeySchema: Match.arrayWith([
              Match.objectLike({ AttributeName: 'userId', KeyType: 'HASH' }),
              Match.objectLike({
                AttributeName: 'createdAt',
                KeyType: 'RANGE',
              }),
            ]),
            Projection: { ProjectionType: 'ALL' },
          }),
          Match.objectLike({
            IndexName: 'IdempotencyIndex',
            KeySchema: Match.arrayWith([
              Match.objectLike({
                AttributeName: 'idempotencyKey',
                KeyType: 'HASH',
              }),
            ]),
            Projection: { ProjectionType: 'ALL' },
          }),
        ]),
        PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
        SSESpecification: { SSEEnabled: true },
        StreamSpecification: {
          StreamViewType: 'NEW_AND_OLD_IMAGES',
        },
        TimeToLiveSpecification: Match.objectLike({
          AttributeName: 'ttl',
          Enabled: true,
        }),
      });
    });
  });

  describe('S3 Buckets', () => {
    it('should create Product bucket with correct configuration', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: Match.stringLikeRegexp('.*-products-.*'),
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
        VersioningConfiguration: {
          Status: 'Enabled',
        },
        LifecycleConfiguration: {
          Rules: Match.arrayWith([
            Match.objectLike({
              Id: 'DeleteOldVersions',
              Status: 'Enabled',
            }),
          ]),
        },
      });
    });

    it('should create User bucket with correct configuration', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: Match.stringLikeRegexp('.*-users-.*'),
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });
  });

  describe('Lambda Functions', () => {
    it('should create Product Lambda function', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'nodejs18.x',
        Handler: 'dist/index.handler',
        MemorySize: 512,
        Timeout: 30,
        Environment: {
          Variables: Match.objectLike({
            NODE_ENV: 'production',
            PRODUCTS_TABLE: Match.anyValue(),
            PRODUCT_BUCKET: Match.anyValue(),
          }),
        },
        VpcConfig: Match.objectLike({
          SecurityGroupIds: Match.arrayWith([Match.anyValue()]),
          SubnetIds: Match.arrayWith([Match.anyValue()]),
        }),
      });
    });

    it('should create User Lambda function', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'nodejs18.x',
        Handler: 'dist/index.handler',
        MemorySize: 512,
        Timeout: 30,
        Environment: {
          Variables: Match.objectLike({
            NODE_ENV: 'production',
            USERS_TABLE: Match.anyValue(),
            USER_BUCKET: Match.anyValue(),
          }),
        },
        VpcConfig: Match.objectLike({
          SecurityGroupIds: Match.arrayWith([Match.anyValue()]),
          SubnetIds: Match.arrayWith([Match.anyValue()]),
        }),
      });
    });

    it('should create Order Lambda function', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'nodejs18.x',
        Handler: 'dist/index.handler',
        MemorySize: 512,
        Timeout: 30,
        Environment: {
          Variables: Match.objectLike({
            NODE_ENV: 'production',
            ORDERS_TABLE: Match.anyValue(),
            USERS_TABLE: Match.anyValue(),
            PRODUCTS_TABLE: Match.anyValue(),
          }),
        },
        VpcConfig: Match.objectLike({
          SecurityGroupIds: Match.arrayWith([Match.anyValue()]),
          SubnetIds: Match.arrayWith([Match.anyValue()]),
        }),
      });
    });

    it('should create Lambda layer', () => {
      template.hasResourceProperties('AWS::Lambda::LayerVersion', {
        CompatibleRuntimes: ['nodejs18.x'],
        Description: 'Common dependencies for e-commerce Lambda functions',
      });
    });
  });

  describe('AppSync GraphQL API', () => {
    it('should create GraphQL API with correct configuration', () => {
      template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
        Name: 'Ecommerce GraphQL API',
        AuthenticationType: 'API_KEY',
        XrayEnabled: true,
        LogConfig: {
          FieldLogLevel: 'ALL',
          CloudWatchLogsRoleArn: Match.anyValue(),
        },
      });
    });

    it('should create GraphQL schema', () => {
      template.hasResource('AWS::AppSync::GraphQLSchema', {});
    });

    it('should create API key', () => {
      template.hasResource('AWS::AppSync::ApiKey', {});
    });

    it('should create data sources for all Lambda functions', () => {
      template.hasResourceProperties('AWS::AppSync::DataSource', {
        Name: 'ProductDataSource',
        Type: 'AWS_LAMBDA',
      });

      template.hasResourceProperties('AWS::AppSync::DataSource', {
        Name: 'UserDataSource',
        Type: 'AWS_LAMBDA',
      });

      template.hasResourceProperties('AWS::AppSync::DataSource', {
        Name: 'OrderDataSource',
        Type: 'AWS_LAMBDA',
      });
    });

    it('should create resolvers for all operations', () => {
      // Product resolvers
      template.hasResourceProperties('AWS::AppSync::Resolver', {
        FieldName: 'listProducts',
        TypeName: 'Query',
      });

      template.hasResourceProperties('AWS::AppSync::Resolver', {
        FieldName: 'getProduct',
        TypeName: 'Query',
      });

      template.hasResourceProperties('AWS::AppSync::Resolver', {
        FieldName: 'createProduct',
        TypeName: 'Mutation',
      });

      // User resolvers
      template.hasResourceProperties('AWS::AppSync::Resolver', {
        FieldName: 'listUsers',
        TypeName: 'Query',
      });

      // Order resolvers
      template.hasResourceProperties('AWS::AppSync::Resolver', {
        FieldName: 'listOrders',
        TypeName: 'Query',
      });
    });
  });

  describe('WAF Web ACL', () => {
    it('should create WAF Web ACL with security rules', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACL', {
        Scope: 'REGIONAL',
        DefaultAction: {
          Allow: {},
        },
        Rules: Match.arrayWith([
          Match.objectLike({
            Name: 'RateLimitRule',
            Priority: 1,
            Statement: {
              RateBasedStatement: {
                AggregateKeyType: 'IP',
                Limit: 2000,
              },
            },
          }),
          Match.objectLike({
            Name: 'SQLInjectionRule',
            Priority: 2,
            Statement: {
              ManagedRuleGroupStatement: {
                Name: 'AWSManagedRulesSQLiRuleSet',
                VendorName: 'AWS',
              },
            },
          }),
        ]),
      });
    });
  });

  describe('CloudWatch Dashboard', () => {
    it('should create monitoring dashboard', () => {
      template.hasResourceProperties('AWS::CloudWatch::Dashboard', {
        DashboardName: 'Ecommerce-Monitoring',
      });
    });
  });

  describe('IAM Permissions', () => {
    it('should grant DynamoDB permissions to Lambda functions', () => {
      // Find all IAM policies
      const policies = template.findResources('AWS::IAM::Policy');
      const policyValues = Object.values(policies);

      // Check that at least one policy grants DynamoDB permissions
      const hasDynamoDBPermissions = policyValues.some(
        (policy: IAMPolicyStatement) => {
          const statements = policy.Properties?.PolicyDocument?.Statement || [];
          return statements.some((statement) => {
            const actions = statement.Action || [];
            return (
              actions.includes('dynamodb:GetItem') ||
              actions.includes('dynamodb:PutItem') ||
              actions.includes('dynamodb:Query')
            );
          });
        },
      );

      expect(hasDynamoDBPermissions).toBe(true);
    });

    it('should grant S3 permissions to Lambda functions', () => {
      // Find all IAM policies
      const policies = template.findResources('AWS::IAM::Policy');
      const policyValues = Object.values(policies);

      // Check that at least one policy grants S3 permissions
      const hasS3Permissions = policyValues.some(
        (policy: IAMPolicyStatement) => {
          const statements = policy.Properties?.PolicyDocument?.Statement || [];
          return statements.some((statement) => {
            const actions = statement.Action || [];
            return (
              actions.includes('s3:GetObject') ||
              actions.includes('s3:PutObject') ||
              actions.includes('s3:DeleteObject')
            );
          });
        },
      );

      expect(hasS3Permissions).toBe(true);
    });
  });

  describe('Outputs', () => {
    it('should export GraphQL API URL', () => {
      template.hasOutput('GraphQLApiUrl', {
        Description: 'AppSync GraphQL API URL',
      });
    });

    it('should export GraphQL API Key', () => {
      template.hasOutput('GraphQLApiKey', {
        Description: 'AppSync GraphQL API Key',
      });
    });

    it('should export DynamoDB table names', () => {
      template.hasOutput('ProductsTableName', {
        Description: 'DynamoDB Products table name',
      });

      template.hasOutput('UsersTableName', {
        Description: 'DynamoDB Users table name',
      });

      template.hasOutput('OrdersTableName', {
        Description: 'DynamoDB Orders table name',
      });
    });

    it('should export S3 bucket names', () => {
      template.hasOutput('ProductBucketName', {
        Description: 'Product S3 bucket name',
      });

      template.hasOutput('UserBucketName', {
        Description: 'User S3 bucket name',
      });
    });
  });

  describe('Tags', () => {
    it('should have VPC resource with tags', () => {
      const vpcs = template.findResources('AWS::EC2::VPC');
      expect(Object.keys(vpcs).length).toBeGreaterThan(0);

      // Just verify that tags exist (CDK manages tag format)
      const vpc = Object.values(vpcs)[0] as PlainObject<{ Tags: string[] }>;
      expect(vpc.Properties.Tags).toBeDefined();
      expect(Array.isArray(vpc.Properties.Tags)).toBe(true);
    });
  });
});
