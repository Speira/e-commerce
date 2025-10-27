#!/bin/bash

# E-commerce Infrastructure Deployment Script
# This script builds and deploys the complete e-commerce infrastructure

set -e

echo "🚀 Starting e-commerce infrastructure deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "AWS CLI is configured"

# Check if CDK is installed
if ! command -v npx cdk &> /dev/null; then
    print_error "AWS CDK is not installed. Please install it first."
    exit 1
fi

print_status "AWS CDK is available"

# Setup CDK environment to use local temp directory
print_status "Setting up CDK environment..."
mkdir -p .tmp
export TMPDIR="$(pwd)/.tmp"
export CDK_OUTDIR="$(pwd)/cdk.out"
print_success "CDK environment configured (using local .tmp directory)"

# Build Lambda layers
print_status "Building Lambda layers..."
cd lambda/layers/nodejs
pnpm install
pnpm build:prod
cd ../../..

# Build Lambda functions
print_status "Building Lambda functions..."
cd lambda/functions/products
pnpm install
pnpm build:prod
cd ../users
pnpm install
pnpm build:prod
cd ../orders
pnpm install
pnpm build:prod
cd ../../..

# Install CDK dependencies
print_status "Installing CDK dependencies..."
pnpm install

# Synthesize CDK app
print_status "Synthesizing CDK app..."
npx cdk synth

# Deploy infrastructure
print_status "Deploying infrastructure..."
npx cdk deploy --all --require-approval never

print_status "✅ Infrastructure deployment completed successfully!"

# Get the GraphQL API endpoint
print_status "Getting GraphQL API endpoint..."
GRAPHQL_URL=$(aws appsync list-graphql-apis --query 'graphqlApis[?name==`Ecommerce GraphQL API`].uris.GRAPHQL' --output text)

if [ -n "$GRAPHQL_URL" ]; then
    print_status "GraphQL API URL: $GRAPHQL_URL"
    echo "GRAPHQL_URL=$GRAPHQL_URL" > .env
else
    print_warning "Could not retrieve GraphQL API URL"
fi

print_status "🎉 Deployment completed! Your e-commerce infrastructure is now live."
print_status "📊 You can monitor your resources in the AWS Console:"
print_status "   - AppSync: https://eu-west-3.console.aws.amazon.com/appsync/home"
print_status "   - DynamoDB: https://eu-west-3.console.aws.amazon.com/dynamodb/home"
print_status "   - Lambda: https://eu-west-3.console.aws.amazon.com/lambda/home"
print_status "   - S3: https://eu-west-3.console.aws.amazon.com/s3/home"
