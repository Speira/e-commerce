# E-commerce Skeleton Project

A complete, production-ready e-commerce infrastructure skeleton built with AWS CDK, designed for modern web applications with security, scalability, and maintainability in mind.

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
├── infra/                             # Infrastructure as Code
│   ├── cdk/                          # AWS CDK Infrastructure
│   │   ├── bin/                      # CDK app entry points
│   │   ├── lib/                      # CDK stack definitions
│   │   ├── lambda/                   # Lambda functions & layers
│   │   ├── graphql/                  # GraphQL schema & resolvers
│   │   ├── deploy.sh                 # Deployment script
│   │   └── test-graphql.sh           # API testing
│   ├── terraform/                    # Future Terraform configs
│   ├── kubernetes/                   # Future K8s manifests
│   ├── docker/                       # Future Docker configs
│   └── README.md                     # Infrastructure docs
├── frontend/                         # Future frontend application
├── .vscode/                          # VS Code configuration
├── package.json                      # Root dependencies
└── README.md                         # This file
```

## Quick Start

### Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ and npm/pnpm
- AWS CDK CLI: `npm install -g aws-cdk`
- VS Code (recommended) with extensions for TypeScript and ESLint

### 1. Clone and Setup

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Deploy Infrastructure

```bash
cd infra/cdk
./deploy.sh
```

This will:

- Install all dependencies
- Bootstrap CDK (if needed)
- Deploy the complete infrastructure
- Generate deployment outputs

### 3. Test the GraphQL API

The deployment will output the GraphQL API URL and API Key. You can test the endpoints:

```bash
# Test all GraphQL endpoints
./test-graphql.sh
```

### 4. Test the GraphQL API

The deployment will output the GraphQL API URL and API Key. You can test the endpoints:

```bash
# Test all GraphQL endpoints
./test-graphql.sh <graphql-url> <api-key>

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

- **Encryption at Rest** - RDS and S3 encryption
- **Encryption in Transit** - TLS for all connections
- **Secrets Manager** - Secure credential storage

### Application Security

- **WAF Protection** - Rate limiting and SQL injection prevention
- **IAM Roles** - Least privilege access
- **Input Validation** - Request sanitization

## Monitoring and Logging

### CloudWatch Dashboard

- API Gateway request metrics
- Lambda function performance
- Database connection monitoring
- Error tracking and alerting

### Logging

- Lambda function logs
- API Gateway access logs
- RDS slow query logs
- Security event logging

## Cost Optimization

### Development Settings

- Single NAT Gateway
- T3.micro RDS instance
- Minimal Lambda memory allocation
- S3 lifecycle policies

### Production Recommendations

- Enable Multi-AZ for RDS
- Increase Lambda memory for performance
- Enable RDS deletion protection
- Set up cost alerts

## Development Workflow

### Local Development

1. Use AWS SAM for local Lambda testing
2. Connect to local PostgreSQL for database testing
3. Use environment variables for configuration

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

- Create React/Vue.js frontend application
- Implement user authentication and authorization
- Add payment processing integration
- Build responsive product catalog

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
# Deploy infrastructure
cd infra/cdk
./deploy.sh

# Deploy to production
./deploy.sh production

# View stack outputs
cdk list

# Destroy infrastructure
cdk destroy

# View logs
npm run logs

# Generate outputs
npm run outputs
```

## Documentation

- [Infrastructure Documentation](infra/cdk/README.md)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [API Documentation](infra/cdk/README.md#api-endpoints)
- [Security Best Practices](infra/cdk/README.md#security-features)

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

1. Check the [Infrastructure Documentation](infra/cdk/README.md)
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
