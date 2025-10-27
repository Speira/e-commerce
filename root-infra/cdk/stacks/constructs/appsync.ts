import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface AppSyncApiProps {
  readonly productFunction: lambda.IFunction;
  readonly userFunction: lambda.IFunction;
  readonly orderFunction: lambda.IFunction;
  readonly userPool?: cognito.IUserPool;
}

export class AppSyncApi extends Construct {
  public readonly graphqlApi: appsync.GraphqlApi;

  constructor(scope: Construct, id: string, props: AppSyncApiProps) {
    super(scope, id);

    // AppSync GraphQL API with Cognito authentication
    const authConfig: appsync.AuthorizationConfig = props.userPool
      ? {
          // Primary auth: Cognito User Pool
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.userPool,
            },
          },
          // Secondary auth: API Key (for testing/development)
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.days(365)),
              },
            },
          ],
        }
      : {
          // Fallback to API Key only if no user pool
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
          },
        };

    this.graphqlApi = new appsync.GraphqlApi(this, 'EcommerceGraphQL', {
      name: 'Ecommerce GraphQL API',
      definition: appsync.Definition.fromFile('graphql/schema.graphql'),
      authorizationConfig: authConfig,
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
        retention: logs.RetentionDays.ONE_WEEK,
      },
    });

    // Data Sources
    const productDataSource = this.graphqlApi.addLambdaDataSource(
      'ProductDataSource',
      props.productFunction,
    );
    const userDataSource = this.graphqlApi.addLambdaDataSource(
      'UserDataSource',
      props.userFunction,
    );
    const orderDataSource = this.graphqlApi.addLambdaDataSource(
      'OrderDataSource',
      props.orderFunction,
    );

    // Product resolvers
    productDataSource.createResolver('QueryListProducts', {
      typeName: 'Query',
      fieldName: 'listProducts',
    });

    productDataSource.createResolver('QueryGetProduct', {
      typeName: 'Query',
      fieldName: 'getProduct',
    });

    productDataSource.createResolver('MutationCreateProduct', {
      typeName: 'Mutation',
      fieldName: 'createProduct',
    });

    productDataSource.createResolver('MutationUpdateProduct', {
      typeName: 'Mutation',
      fieldName: 'updateProduct',
    });

    productDataSource.createResolver('MutationDeleteProduct', {
      typeName: 'Mutation',
      fieldName: 'deleteProduct',
    });

    // User resolvers
    userDataSource.createResolver('QueryListUsers', {
      typeName: 'Query',
      fieldName: 'listUsers',
    });

    userDataSource.createResolver('QueryGetUser', {
      typeName: 'Query',
      fieldName: 'getUser',
    });

    userDataSource.createResolver('MutationCreateUser', {
      typeName: 'Mutation',
      fieldName: 'createUser',
    });

    userDataSource.createResolver('MutationUpdateUser', {
      typeName: 'Mutation',
      fieldName: 'updateUser',
    });

    userDataSource.createResolver('MutationDeleteUser', {
      typeName: 'Mutation',
      fieldName: 'deleteUser',
    });

    // Order resolvers
    orderDataSource.createResolver('QueryListOrders', {
      typeName: 'Query',
      fieldName: 'listOrders',
    });

    orderDataSource.createResolver('QueryGetOrder', {
      typeName: 'Query',
      fieldName: 'getOrder',
    });

    orderDataSource.createResolver('QueryGetOrdersByUser', {
      typeName: 'Query',
      fieldName: 'getOrdersByUser',
    });

    orderDataSource.createResolver('MutationCreateOrder', {
      typeName: 'Mutation',
      fieldName: 'createOrder',
    });

    orderDataSource.createResolver('MutationUpdateOrder', {
      typeName: 'Mutation',
      fieldName: 'updateOrder',
    });

    orderDataSource.createResolver('MutationDeleteOrder', {
      typeName: 'Mutation',
      fieldName: 'deleteOrder',
    });
  }
}
