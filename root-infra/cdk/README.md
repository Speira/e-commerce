# E-Commerce Infrastructure (CDK)

AWS CDK infrastructure for a secure, scalable e-commerce application.

## Overview

This CDK project defines the complete AWS infrastructure including:

- **AppSync GraphQL API** with Lambda resolvers
- **DynamoDB tables** for Products, Users, and Orders
- **Lambda Functions** for business logic (Orders, Products, Users)
- **Lambda Layers** for shared utilities
- **S3 buckets** for static assets
- **Cognito** for authentication
- **WAF** for security
- **CloudWatch** for monitoring

## Project Structure

```
root-infra/cdk/
├── bin/
│   └── cdk.ts                 # CDK app entry point
├── stacks/
│   ├── ecommerce-infrastructure-stack.ts
│   └── constructs/            # CDK constructs
│       ├── appsync.ts
│       ├── cognito.ts
│       ├── database.ts
│       ├── lambdas.ts
│       ├── monitoring.ts
│       ├── networking.ts
│       ├── security.ts
│       └── storage.ts
├── lambda/
│   ├── functions/
│   │   ├── orders/           # Orders Lambda with tests
│   │   ├── products/         # Products Lambda with tests
│   │   └── users/            # Users Lambda with tests
│   ├── layers/
│   │   └── nodejs/           # Shared utilities layer with tests
│   └── test-utils/           # Shared test utilities
├── scripts/                  # Deployment & testing scripts
│   ├── cdk-wrapper.sh        # CDK wrapper with custom settings
│   ├── cleanup.sh            # Cleanup temporary files
│   ├── deploy.sh             # Full deployment pipeline
│   ├── get-outputs.sh        # Extract deployment outputs
│   ├── test-api.sh           # REST API testing
│   └── test-graphql.sh       # GraphQL API testing
└── test/                     # Infrastructure & integration tests
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- AWS CLI configured
- AWS CDK CLI installed globally: `npm install -g aws-cdk`

### Installation

```bash
# Install dependencies
pnpm install

# Install lambda dependencies
pnpm run install:lambda
```

### Development

```bash
# Build TypeScript
pnpm build

# Build in watch mode
pnpm watch

# Build lambdas
pnpm run build:lambda
```

### Deployment

```bash
# Bootstrap CDK (first time only)
pnpm run bootstrap

# Deploy to development
pnpm deploy

# Deploy to production
pnpm run deploy:prod

# Synthesize CloudFormation
pnpm synth

# View differences
pnpm diff
```

### Testing

```bash
# Run all tests (infrastructure + lambdas + layers)
pnpm test

# Run specific test suites
pnpm run test:infrastructure    # CDK stack tests
pnpm run test:integration       # Integration tests
pnpm run test:lambda            # All lambda tests
pnpm run test:lambda:orders     # Orders lambda only
pnpm run test:lambda:products   # Products lambda only
pnpm run test:lambda:users      # Users lambda only
pnpm run test:layer             # Layer tests

# Run with coverage
pnpm run test:coverage

# Run in watch mode
pnpm run test:watch
```

See [test/README.md](test/README.md) for detailed testing documentation.

## Scripts

The `scripts/` directory contains helpful shell scripts for deployment and testing:

### cdk-wrapper.sh

Wraps CDK commands with custom settings (used by all package.json CDK commands):

- Sets local temp directory to avoid polluting system `/tmp`
- Configures CDK output directory
- Used internally by package.json scripts

### deploy.sh

Full deployment pipeline with validation:

```bash
./scripts/deploy.sh              # Deploy to development
./scripts/deploy.sh production   # Deploy to production
```

Features:

- Checks AWS CLI configuration
- Installs dependencies
- Builds Lambda functions
- Deploys infrastructure
- Displays deployment outputs

### cleanup.sh

Comprehensive cleanup script:

```bash
./scripts/cleanup.sh
```

Cleans:

- CDK temporary files and cache
- Lambda build artifacts
- Node modules (optional)
- Displays freed disk space

### get-outputs.sh

Extract and display CDK stack outputs:

```bash
./scripts/get-outputs.sh
```

Displays:

- GraphQL API URL and API Key
- DynamoDB table names
- S3 bucket names
- Cognito User Pool details

### test-graphql.sh

Test GraphQL API endpoints:

```bash
./scripts/test-graphql.sh <graphql-url> <api-key>
```

Tests all CRUD operations for:

- Products
- Users
- Orders

### test-api.sh

Test REST API endpoints (if applicable):

```bash
./scripts/test-api.sh <api-url>
```

## Lambda Functions

### Orders Lambda

Handles order management operations.

- **Location**: `lambda/functions/orders/`
- **Documentation**: [lambda/functions/orders/README.md](lambda/functions/orders/README.md)
- **Features**: Idempotency, atomic transactions, Effect TS proof of concept

```bash
cd lambda/functions/orders
pnpm test
pnpm build
```

### Products Lambda

Manages product catalog.

- **Location**: `lambda/functions/products/`
- **Operations**: CRUD for products, inventory management

```bash
cd lambda/functions/products
pnpm test
pnpm build
```

### Users Lambda

User management and profiles.

- **Location**: `lambda/functions/users/`
- **Operations**: User CRUD, role management

```bash
cd lambda/functions/users
pnpm test
pnpm build
```

## Lambda Layers

### Nodejs Layer

Shared utilities for all Lambda functions.

- **Location**: `lambda/layers/nodejs/`
- **Includes**: Database utilities, response helpers, error handling, logging, auth

```bash
cd lambda/layers/nodejs
pnpm test
pnpm build
```

## Testing Strategy

Tests are co-located with the code they test:

- **Infrastructure tests**: `test/` - CDK stack and constructs
- **Lambda tests**: `lambda/functions/*/test/` - Co-located with each lambda
- **Layer tests**: `lambda/layers/nodejs/test/` - Co-located with layer code
- **Shared utilities**: `lambda/test-utils/` - Mocks, factories, setup helpers

### Test Structure Benefits

✅ **Co-location**: Tests live with the code they test  
✅ **Independence**: Each lambda can be tested independently  
✅ **Scalability**: Easy to add new lambdas with their own tests  
✅ **Reusability**: Shared test utilities reduce duplication  
✅ **CI/CD**: Run specific test suites when only certain code changes

See [test/README.md](test/README.md) for comprehensive testing guide.

## Environment Variables

### Lambda Environment Variables (Set by CDK)

- `AWS_REGION`: AWS region
- `PRODUCTS_TABLE`: DynamoDB products table name
- `USERS_TABLE`: DynamoDB users table name
- `ORDERS_TABLE`: DynamoDB orders table name
- `PRODUCT_BUCKET`: S3 bucket for product images
- `USER_BUCKET`: S3 bucket for user avatars

### CDK Context Variables

Set in `cdk.json` or via command line:

```bash
cdk deploy --context environment=production
```

## GraphQL API

### Schema

The GraphQL schema is defined in the `@speira/e-commerce-schema` package (`root-schema/graphql/schema.graphql`) and deployed to AWS AppSync.

### Resolvers

All resolvers use Lambda functions with direct mapping:

- `Query.getProduct` → Products Lambda
- `Query.getOrder` → Orders Lambda
- `Mutation.createOrder` → Orders Lambda
- etc.

### Testing the API

```bash
# Test GraphQL queries
./scripts/test-graphql.sh

# Test REST endpoints
./scripts/test-api.sh
```

## Database

### DynamoDB Tables

- **ProductsTable**: Product catalog
- **UsersTable**: User profiles and auth
- **OrdersTable**: Order history and tracking

See [DYNAMODB_INDEXES.md](DYNAMODB_INDEXES.md) for index details.

## Authentication

Uses AWS Cognito for user authentication.

See [COGNITO_SETUP.md](COGNITO_SETUP.md) for setup instructions.

## Monitoring

CloudWatch dashboards and alarms are automatically created for:

- Lambda function errors and duration
- DynamoDB throttles and consumed capacity
- AppSync request counts and latency
- WAF blocked requests

## Security

- **WAF**: Rate limiting, SQL injection protection
- **IAM**: Least privilege access
- **VPC**: Network isolation
- **Encryption**: At rest (S3, DynamoDB) and in transit (TLS)

See [AWS_SETUP.md](AWS_SETUP.md) for security configuration.

## Cost Optimization

See [COST_OPTIMIZATION.md](COST_OPTIMIZATION.md) for cost-saving strategies.

## Useful Commands

```bash
# CDK commands
pnpm synth          # Synthesize CloudFormation
pnpm deploy         # Deploy stack
pnpm diff           # Compare deployed stack with current state
pnpm destroy        # Destroy stack

# Lambda commands
pnpm run build:lambda      # Build all lambdas
pnpm run install:lambda    # Install lambda dependencies

# Testing
pnpm test                  # Run all tests
pnpm run test:coverage     # Run with coverage
pnpm run test:watch        # Watch mode

# Logs
pnpm logs                  # Tail lambda logs
```

## Development Workflow

1. **Make changes** to lambda code or infrastructure
2. **Run tests** locally: `pnpm test`
3. **Build**: `pnpm build` and `pnpm run build:lambda`
4. **Deploy to dev**: `pnpm deploy` or `./scripts/deploy.sh`
5. **Test deployed API**: `./scripts/test-graphql.sh`
6. **Deploy to prod**: `pnpm run deploy:prod` or `./scripts/deploy.sh production`

## Documentation

- [Testing Guide](test/README.md) - Comprehensive testing documentation
- [Orders Lambda](lambda/functions/orders/README.md) - Orders implementation details
- [Test Utils](lambda/test-utils/README.md) - Shared test utilities
- [DynamoDB Indexes](DYNAMODB_INDEXES.md) - Database schema and indexes
- [Cognito Setup](COGNITO_SETUP.md) - Authentication setup
- [AWS Setup](AWS_SETUP.md) - AWS account configuration
- [Cost Optimization](COST_OPTIMIZATION.md) - Cost-saving strategies
- [Deployment Guide](DEPLOYMENT.md) - Production deployment guide
- [Effect TS POC](lambda/functions/orders/EFFECT_TS_MIGRATION.md) - Effect TS evaluation

## Troubleshooting

### CDK Bootstrap Issues

```bash
# Re-bootstrap with specific account/region
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Lambda Build Issues

```bash
# Clean and rebuild
rm -rf lambda/*/dist lambda/*/node_modules
pnpm run install:lambda
pnpm run build:lambda
```

### Test Failures

```bash
# Run with verbose output
pnpm run test:verbose

# Run specific test file
pnpm test lambda/functions/orders/test/index.test.ts
```

## Contributing

1. Follow TypeScript best practices
2. Add tests for all new features
3. Update documentation
4. Run linter: `pnpm lint`
5. Ensure tests pass: `pnpm test`

## License

[Your License Here]
