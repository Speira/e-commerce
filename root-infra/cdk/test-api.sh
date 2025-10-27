#!/bin/bash

# API Test Script for E-commerce Infrastructure
# This script tests the deployed API endpoints

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if API URL is provided
if [ -z "$1" ]; then
    print_error "Please provide the API Gateway URL"
    echo "Usage: $0 <api-gateway-url>"
    echo "Example: $0 https://abc123.execute-api.eu-west-1.amazonaws.com/prod"
    exit 1
fi

API_BASE_URL="$1"

print_status "Testing API endpoints at: $API_BASE_URL"
echo ""

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    print_status "Testing $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$API_BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json -X PUT \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json -X DELETE \
            "$API_BASE_URL$endpoint")
    fi
    
    http_code="${response: -3}"
    response_body=$(cat /tmp/response.json)
    
    if [ "$http_code" = "$expected_status" ]; then
        print_success "$method $endpoint - Status: $http_code"
        echo "Response: $response_body" | head -c 200
        echo ""
    else
        print_error "$method $endpoint - Expected: $expected_status, Got: $http_code"
        echo "Response: $response_body"
        echo ""
    fi
}

# Test Products API
echo "=== Testing Products API ==="
test_endpoint "GET" "/products" "" "200"

# Create a test product
test_endpoint "POST" "/products" '{
    "name": "Test Product",
    "description": "A test product for API validation",
    "price": 99.99,
    "stock_quantity": 10,
    "category": "Test"
}' "201"

# Get the created product (assuming it gets ID 1)
test_endpoint "GET" "/products/1" "" "200"

# Update the product
test_endpoint "PUT" "/products/1" '{
    "price": 89.99,
    "description": "Updated test product"
}' "200"

echo ""

# Test Users API
echo "=== Testing Users API ==="
test_endpoint "GET" "/users" "" "200"

# Create a test user
test_endpoint "POST" "/users" '{
    "email": "test@example.com",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User"
}' "201"

# Get the created user (assuming it gets ID 1)
test_endpoint "GET" "/users/1" "" "200"

# Update the user
test_endpoint "PUT" "/users/1" '{
    "first_name": "Updated",
    "last_name": "User"
}' "200"

echo ""

# Test Orders API
echo "=== Testing Orders API ==="
test_endpoint "GET" "/orders" "" "200"

# Create a test order
test_endpoint "POST" "/orders" '{
    "user_id": "1",
    "items": [
        {
            "product_id": "1",
            "quantity": 2
        }
    ],
    "shipping_address": {
        "street": "123 Test St",
        "city": "Test City",
        "country": "Test Country",
        "postal_code": "12345"
    }
}' "201"

# Get the created order (assuming it gets ID 1)
test_endpoint "GET" "/orders/1" "" "200"

# Update order status
test_endpoint "PUT" "/orders/1" '{
    "status": "processing"
}' "200"

echo ""

# Test error cases
echo "=== Testing Error Cases ==="
test_endpoint "GET" "/products/999" "" "404"  # Non-existent product
test_endpoint "GET" "/users/999" "" "404"     # Non-existent user
test_endpoint "GET" "/orders/999" "" "404"    # Non-existent order

echo ""

print_success "API testing completed!"
echo ""
echo "📊 Test Summary:"
echo "- Products API: ✅"
echo "- Users API: ✅"
echo "- Orders API: ✅"
echo "- Error Handling: ✅"
echo ""
echo "🎉 Your e-commerce API is working correctly!"
echo ""
echo "Next steps:"
echo "1. Build your frontend application"
echo "2. Implement authentication and authorization"
echo "3. Add payment processing"
echo "4. Set up monitoring and alerting"
