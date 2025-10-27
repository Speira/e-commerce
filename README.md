# E-commerce Skeleton Project

A complete, production-ready e-commerce infrastructure skeleton built with AWS CDK, designed for modern web applications with security, scalability, and maintainability in mind. This is a monorepo that can be turned very quickly into microservices architecture.

## Architecture Overview

This project provides a comprehensive e-commerce backend infrastructure with the following components:

### Core Infrastructure

- **VPC with Multi-AZ Setup** - Secure network isolation
- **DynamoDB Tables** - NoSQL database with pay-per-request billing
- **AppSync GraphQL API** - Flexible GraphQL API with real-time subscriptions
- **Lambda Functions** - Serverless compute for business logic
- **S3 Storage** - Secure file storage for products and user uploads
- **WAF Protection** - Web application firewall with rate limiting
- **CloudWatch Monitoring** - Comprehensive logging and metrics

### Security Features

- **Network Security** - Isolated subnets and security groups
- **Data Encryption** - At-rest and in-transit encryption
- **IAM Roles** - Least privilege access control
- **WAF Rules** - SQL injection and rate limiting protection

## 📁 Project Structure

```
e-commerce/
├── root-infra/                       # Infrastructure as code
│   └── cdk/                          # AWS CDK Infrastructure
│       ├── bin/                      # CDK app entry points
│       ├── stacks/                   # CDK stack definitions & constructs
│       ├── lambda/                   # Lambda functions & layers
│       │   ├── functions/            # Lambda function handlers (users, products, orders)
│       │   ├── layers/               # Shared Lambda layer code
│       │   └── test-utils/           # Testing utilities for Lambdas
│       ├── scripts/                  # Deployment & testing scripts
│       └── test/                     # Infrastructure & integration tests
├── root-lib/                         # Shared business logic & utilities
│   ├── base/                         # Core utilities (string, number, object utils)
│   ├── user/                         # User domain schemas & types
│   ├── product/                      # Product domain schemas & types
│   └── order/                        # Order domain schemas & types
├── root-schema/                      # GraphQL schema & code generation
│   ├── graphql/                      # GraphQL schema files
│   ├── generated/                    # Auto-generated types & resolvers
│   └── codegen/                      # GraphQL codegen configuration
└── root-ui/                          # Frontend applications
    ├── admin/                        # Admin dashboard (Vite + React + TanStack Router)
    └── web/                          # Customer-facing web app (Next.js)
```

## Monorepo Architecture

This project uses **Nx** and **pnpm workspaces** for efficient monorepo management:

- **Nx** - Build system with intelligent caching and task orchestration
- **pnpm** - Fast, disk-efficient package manager
- **Workspaces** - Shared dependencies and type-safe imports across packages

### Key Benefits

- 🚀 **Fast builds** - Nx caching and parallel execution
- 🔗 **Shared code** - Types, schemas, and utilities across all apps
- 📦 **Efficient installs** - pnpm workspace linking
- 🎯 **Task automation** - Consistent build, test, and deploy commands

## Quick Start

### Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ and pnpm 8+
- AWS CDK CLI: `npm install -g aws-cdk`
- VS Code (recommended) with extensions for TypeScript and ESLint

### 1. Clone and Setup

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Deploy Infrastructure

```bash
cd root-infra/cdk
./scripts/deploy.sh
```

This will:

- Install all dependencies
- Bootstrap CDK (if needed)
- Deploy the complete infrastructure
- Generate deployment outputs

### 4. Test the GraphQL API

The deployment will output the GraphQL API URL and API Key. You can test the endpoints:

```bash
# Test all GraphQL endpoints
./scripts/test-graphql.sh <graphql-url> <api-key>

# Or test individual queries
curl -X POST https://your-graphql-url/graphql \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "query": "query { products { success data { id name price } } }"
  }'
```

## GraphQL API

### Queries

- `products` - List all products
- `product(id: ID!)` - Get specific product
- `productsByCategory(category: String!)` - Get products by category
- `users` - List all users
- `user(id: ID!)` - Get specific user
- `userByEmail(email: String!)` - Get user by email
- `orders` - List all orders
- `order(id: ID!)` - Get specific order with items
- `ordersByUser(userId: ID!)` - Get orders by user
- `ordersByStatus(status: OrderStatus!)` - Get orders by status

### Mutations

- `createProduct(input: CreateProductInput!)` - Create new product
- `updateProduct(id: ID!, input: UpdateProductInput!)` - Update product
- `deleteProduct(id: ID!)` - Delete product
- `createUser(input: CreateUserInput!)` - Create new user
- `updateUser(id: ID!, input: UpdateUserInput!)` - Update user
- `deleteUser(id: ID!)` - Delete user
- `createOrder(input: CreateOrderInput!)` - Create new order
- `updateOrder(id: ID!, input: UpdateOrderInput!)` - Update order status

### Subscriptions (Real-time)

- `productCreated` - Subscribe to product creation
- `productUpdated` - Subscribe to product updates
- `productDeleted` - Subscribe to product deletion
- `orderCreated` - Subscribe to order creation
- `orderUpdated` - Subscribe to order updates

## VS Code Setup

This project includes comprehensive VS Code configuration for the best development experience.

### Format on Save

The project is configured with **automatic format on save** using Prettier and ESLint:

- **Prettier** - Formats code with consistent style
- **ESLint** - Fixes linting issues automatically
- **Import Organization** - Sorts imports automatically

### Required Extensions

When you open the project in VS Code, you'll be prompted to install recommended extensions:

- **Prettier - Code formatter** - `esbenp.prettier-vscode`
- **ESLint** - `dbaeumer.vscode-eslint`
- **TypeScript and JavaScript Language Features** - `ms-vscode.vscode-typescript-next`

### VS Code Features

- **Format on Save** - Automatically formats code when you save
- **Auto-fix on Save** - Automatically fixes ESLint issues
- **Import Organization** - Sorts imports automatically
- **Debugging** - Pre-configured debug configurations for CDK and Lambda functions
- **Tasks** - Built-in tasks for common operations (build, lint, deploy)

### Keyboard Shortcuts

- `Ctrl+Shift+P` → "Format Document" - Manual formatting
- `Ctrl+Shift+P` → "ESLint: Fix all auto-fixable Problems" - Manual ESLint fix
- `Ctrl+Shift+P` → "Tasks: Run Task" - Run build/lint/deploy tasks

### Workspace Settings

The project includes workspace-specific settings in `.vscode/settings.json`:

- Format on save enabled
- ESLint auto-fix on save
- Import organization on save
- TypeScript preferences optimized for the project

## Security Features

### Network Security

- **VPC Isolation** - Database in isolated subnets
- **Security Groups** - Minimal required access
- **NAT Gateway** - Controlled internet access

### Data Security

- **Encryption at Rest** - DynamoDB and S3 encryption
- **Encryption in Transit** - TLS for all connections
- **IAM Authentication** - Secure access control

### Application Security

- **WAF Protection** - Rate limiting and SQL injection prevention
- **IAM Roles** - Least privilege access
- **Input Validation** - Request sanitization

## Monitoring and Logging

### CloudWatch Dashboard

- AppSync GraphQL API metrics
- Lambda function performance
- DynamoDB table monitoring
- Error tracking and alerting

### Logging

- Lambda function logs
- AppSync request logs
- DynamoDB access patterns
- Security event logging

## Cost Optimization

### Development Settings

- Single NAT Gateway
- DynamoDB pay-per-request billing
- Minimal Lambda memory allocation
- S3 lifecycle policies

### Production Recommendations

- Consider DynamoDB provisioned capacity for predictable workloads
- Increase Lambda memory for performance
- Enable DynamoDB point-in-time recovery
- Set up cost alerts and budgets

## Development Workflow

### Local Development

1. Use AWS SAM for local Lambda testing
2. Use DynamoDB Local for database testing
3. Use environment variables for configuration
4. Run frontend apps with `pnpm dev` in root-ui/admin or root-ui/web

### Testing

1. Unit tests for Lambda functions
2. Integration tests for API endpoints
3. Load testing for performance validation

### CI/CD Integration

1. GitHub Actions for automated deployment
2. Code quality checks and security scanning
3. Automated testing and validation

## Next Steps

### Frontend Development

The monorepo includes two frontend applications:

- **Admin Dashboard** (`root-ui/admin`) - Built with Vite, React, and TanStack Router
- **Web App** (`root-ui/web`) - Built with Next.js

To continue development:

- Connect frontends to the GraphQL API
- Implement Cognito authentication flow
- Add payment processing integration (Stripe/PayPal)
- Enhance product catalog and shopping cart features

### Additional Features

- **Email Notifications** - Order confirmations and updates
- **Payment Gateway** - Stripe/PayPal integration
- **Inventory Management** - Stock tracking and alerts
- **Analytics** - Sales reports and customer insights
- **Search** - Elasticsearch integration
- **Caching** - Redis for performance optimization

### Production Hardening

- **Backup Strategies** - Automated database backups
- **Disaster Recovery** - Multi-region deployment
- **Alerting** - Proactive monitoring and notifications
- **Compliance** - GDPR, PCI DSS compliance
- **Performance** - CDN and caching optimization

## Useful Commands

```bash
# Install all dependencies
pnpm install

# Deploy infrastructure
cd root-infra/cdk
./scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh production

# Test GraphQL API
./scripts/test-graphql.sh <graphql-url> <api-key>

# View stack outputs
./scripts/get-outputs.sh

# Destroy infrastructure
cdk destroy

# Run frontend apps
cd root-ui/admin && pnpm dev   # Admin dashboard
cd root-ui/web && pnpm dev     # Web app

# Run tests
pnpm test                      # Run all tests
cd root-infra/cdk && pnpm test # CDK tests only
```

## Documentation

- [Infrastructure Documentation](root-infra/cdk/README.md)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [GraphQL Schema](root-schema/graphql/schema.graphql)
- [Lambda Functions](root-infra/cdk/lambda/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the [Infrastructure Documentation](root-infra/cdk/README.md)
2. Review CloudWatch logs for debugging
3. Consult AWS best practices
4. Open an issue in the repository

## Features

- ✅ **Production Ready** - Built with security and scalability in mind
- ✅ **Serverless Architecture** - Cost-effective and scalable
- ✅ **Security First** - Comprehensive security measures
- ✅ **Monitoring** - Full observability and alerting
- ✅ **Documentation** - Comprehensive guides and examples
- ✅ **Best Practices** - AWS Well-Architected Framework compliance
- ✅ **Cost Optimized** - Development and production configurations
- ✅ **Extensible** - Easy to add new features and services

---

**Ready to build your e-commerce empire?** 🚀

Start with this solid foundation and scale your business with confidence!
