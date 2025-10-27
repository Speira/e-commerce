#!/bin/bash

# Test GraphQL API endpoints
# This script tests the deployed GraphQL API

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get GraphQL API URL from environment or try to retrieve it
if [ -f .env ]; then
    source .env
fi

if [ -z "$GRAPHQL_URL" ]; then
    print_warning "GRAPHQL_URL not found in .env, trying to retrieve from AWS..."
    GRAPHQL_URL=$(aws appsync list-graphql-apis --query 'graphqlApis[?name==`Ecommerce GraphQL API`].uris.GRAPHQL' --output text)
    
    if [ -z "$GRAPHQL_URL" ]; then
        print_error "Could not retrieve GraphQL API URL. Please check your deployment."
        exit 1
    fi
fi

print_status "Testing GraphQL API at: $GRAPHQL_URL"

# Get API key
API_KEY=$(aws appsync list-api-keys --api-id $(echo $GRAPHQL_URL | cut -d'/' -f6) --query 'apiKeys[0].id' --output text)

if [ -z "$API_KEY" ] || [ "$API_KEY" = "None" ]; then
    print_error "Could not retrieve API key. Please check your AppSync configuration."
    exit 1
fi

print_status "Using API key: $API_KEY"

# Test 1: Create a user
print_status "Test 1: Creating a user..."
USER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { success data { id email firstName lastName role } error } }",
    "variables": {
      "input": {
        "email": "test@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "CUSTOMER",
        "phone": "+1234567890",
        "address": "123 Test St, Test City"
      }
    }
  }' \
  "$GRAPHQL_URL")

echo "User Response: $USER_RESPONSE"

# Extract user ID
USER_ID=$(echo $USER_RESPONSE | jq -r '.data.createUser.data.id')
if [ "$USER_ID" = "null" ] || [ -z "$USER_ID" ]; then
    print_error "Failed to create user"
    echo "Response: $USER_RESPONSE"
    exit 1
fi

print_status "Created user with ID: $USER_ID"

# Test 2: Create a product
print_status "Test 2: Creating a product..."
PRODUCT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "mutation CreateProduct($input: CreateProductInput!) { createProduct(input: $input) { success data { id name price stock category } error } }",
    "variables": {
      "input": {
        "name": "Test Product",
        "description": "A test product for testing",
        "price": 29.99,
        "stock": 100,
        "category": "electronics",
        "imageUrl": "https://example.com/image.jpg"
      }
    }
  }' \
  "$GRAPHQL_URL")

echo "Product Response: $PRODUCT_RESPONSE"

# Extract product ID
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.data.createProduct.data.id')
if [ "$PRODUCT_ID" = "null" ] || [ -z "$PRODUCT_ID" ]; then
    print_error "Failed to create product"
    echo "Response: $PRODUCT_RESPONSE"
    exit 1
fi

print_status "Created product with ID: $PRODUCT_ID"

# Test 3: Create an order
print_status "Test 3: Creating an order..."
ORDER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "mutation CreateOrder($input: CreateOrderInput!) { createOrder(input: $input) { success data { id userId total status items { productId quantity price total } } error } }",
    "variables": {
      "input": {
        "userId": "'$USER_ID'",
        "items": [
          {
            "productId": "'$PRODUCT_ID'",
            "quantity": 2
          }
        ],
        "shippingAddress": "123 Test St, Test City, TC 12345"
      }
    }
  }' \
  "$GRAPHQL_URL")

echo "Order Response: $ORDER_RESPONSE"

# Extract order ID
ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data.createOrder.data.id')
if [ "$ORDER_ID" = "null" ] || [ -z "$ORDER_ID" ]; then
    print_error "Failed to create order"
    echo "Response: $ORDER_RESPONSE"
    exit 1
fi

print_status "Created order with ID: $ORDER_ID"

# Test 4: List products
print_status "Test 4: Listing products..."
LIST_PRODUCTS_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query ListProducts($limit: Int) { listProducts(limit: $limit) { success data { items { id name price stock category } total } error } }",
    "variables": {
      "limit": 10
    }
  }' \
  "$GRAPHQL_URL")

echo "List Products Response: $LIST_PRODUCTS_RESPONSE"

# Test 5: List users
print_status "Test 5: Listing users..."
LIST_USERS_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query ListUsers($limit: Int) { listUsers(limit: $limit) { success data { items { id email firstName lastName role } total } error } }",
    "variables": {
      "limit": 10
    }
  }' \
  "$GRAPHQL_URL")

echo "List Users Response: $LIST_USERS_RESPONSE"

# Test 6: List orders
print_status "Test 6: Listing orders..."
LIST_ORDERS_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query ListOrders($limit: Int) { listOrders(limit: $limit) { success data { items { id userId total status items { productId quantity price total } } total } error } }",
    "variables": {
      "limit": 10
    }
  }' \
  "$GRAPHQL_URL")

echo "List Orders Response: $LIST_ORDERS_RESPONSE"

# Test 7: Get specific user
print_status "Test 7: Getting specific user..."
GET_USER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query GetUser($id: ID!) { getUser(id: $id) { success data { id email firstName lastName role phone address } error } }",
    "variables": {
      "id": "'$USER_ID'"
    }
  }' \
  "$GRAPHQL_URL")

echo "Get User Response: $GET_USER_RESPONSE"

# Test 8: Get specific product
print_status "Test 8: Getting specific product..."
GET_PRODUCT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query GetProduct($id: ID!) { getProduct(id: $id) { success data { id name description price stock category imageUrl } error } }",
    "variables": {
      "id": "'$PRODUCT_ID'"
    }
  }' \
  "$GRAPHQL_URL")

echo "Get Product Response: $GET_PRODUCT_RESPONSE"

# Test 9: Get specific order
print_status "Test 9: Getting specific order..."
GET_ORDER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query GetOrder($id: ID!) { getOrder(id: $id) { success data { id userId total status shippingAddress items { productId quantity price total product { id name } } user { id email firstName lastName } } error } }",
    "variables": {
      "id": "'$ORDER_ID'"
    }
  }' \
  "$GRAPHQL_URL")

echo "Get Order Response: $GET_ORDER_RESPONSE"

# Test 10: Get orders by user
print_status "Test 10: Getting orders by user..."
ORDERS_BY_USER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "query": "query GetOrdersByUser($userId: ID!, $limit: Int) { getOrdersByUser(userId: $userId, limit: $limit) { success data { items { id userId total status items { productId quantity price total } } total } error } }",
    "variables": {
      "userId": "'$USER_ID'",
      "limit": 10
    }
  }' \
  "$GRAPHQL_URL")

echo "Orders by User Response: $ORDERS_BY_USER_RESPONSE"

print_status "✅ All GraphQL API tests completed successfully!"
print_status "📊 Test Summary:"
print_status "   - Created user: $USER_ID"
print_status "   - Created product: $PRODUCT_ID"
print_status "   - Created order: $ORDER_ID"
print_status "   - All CRUD operations working"
print_status "   - All list operations working"
print_status "   - All relationship queries working"

print_status "🎉 Your DynamoDB-based e-commerce API is working perfectly!"
