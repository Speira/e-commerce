#!/bin/bash

# Script to extract and format CDK outputs for frontend configuration
# Usage: ./get-outputs.sh [stack-name]

STACK_NAME="${1:-TestStack}"

echo "=================================================="
echo "  CDK Outputs for $STACK_NAME"
echo "=================================================="
echo ""

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    exit 1
fi

# Get stack outputs
OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs' \
    --output json 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "Error: Could not find stack '$STACK_NAME'"
    echo "Available stacks:"
    aws cloudformation list-stacks \
        --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
        --query 'StackSummaries[*].StackName' \
        --output table
    exit 1
fi

# Extract specific outputs
USER_POOL_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="CognitoUserPoolId") | .OutputValue')
CLIENT_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="CognitoUserPoolClientId") | .OutputValue')
COGNITO_DOMAIN=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="CognitoDomain") | .OutputValue')
REGION=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="CognitoRegion") | .OutputValue')
APPSYNC_URL=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="GraphQLApiUrl") | .OutputValue')
API_KEY=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="GraphQLApiKey") | .OutputValue')

echo "📱 Cognito Configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "User Pool ID:     $USER_POOL_ID"
echo "Client ID:        $CLIENT_ID"
echo "Domain:           $COGNITO_DOMAIN"
echo "Region:           $REGION"
echo ""

echo "🔌 GraphQL API:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "URL:              $APPSYNC_URL"
echo "API Key:          $API_KEY"
echo ""

echo "📝 Next.js Environment Variables (.env.local):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << EOF
NEXT_PUBLIC_USER_POOL_ID=$USER_POOL_ID
NEXT_PUBLIC_USER_POOL_CLIENT_ID=$CLIENT_ID
NEXT_PUBLIC_COGNITO_REGION=$REGION
NEXT_PUBLIC_COGNITO_DOMAIN=${COGNITO_DOMAIN#https://}
NEXT_PUBLIC_APPSYNC_URL=$APPSYNC_URL
NEXT_PUBLIC_APPSYNC_REGION=$REGION
EOF
echo ""

echo "📝 Vite/React Environment Variables (.env):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << EOF
VITE_USER_POOL_ID=$USER_POOL_ID
VITE_USER_POOL_CLIENT_ID=$CLIENT_ID
VITE_COGNITO_REGION=$REGION
VITE_COGNITO_DOMAIN=${COGNITO_DOMAIN#https://}
VITE_APPSYNC_URL=$APPSYNC_URL
VITE_APPSYNC_REGION=$REGION
EOF
echo ""

echo "🔗 Google OAuth Redirect URI:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
DOMAIN_ONLY=$(echo "$COGNITO_DOMAIN" | sed 's|https://||')
echo "$COGNITO_DOMAIN/oauth2/idpresponse"
echo ""
echo "Add this URL to your Google OAuth Client configuration:"
echo "https://console.cloud.google.com/apis/credentials"
echo ""

echo "👤 Create Admin User:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << EOF
aws cognito-idp admin-create-user \\
  --user-pool-id $USER_POOL_ID \\
  --username admin@example.com \\
  --user-attributes Name=email,Value=admin@example.com \\
  --temporary-password TempPass123!

aws cognito-idp admin-add-user-to-group \\
  --user-pool-id $USER_POOL_ID \\
  --username admin@example.com \\
  --group-name ADMIN
EOF
echo ""

echo "=================================================="
echo "  Configuration complete! 🎉"
echo "=================================================="

