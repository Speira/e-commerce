#!/bin/bash
# CDK wrapper that uses local temp directory
# This ensures CDK doesn't pollute system /tmp

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[CDK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[CDK]${NC} $1"
}

# Create local temp directory
mkdir -p .tmp

# Set environment variables
export TMPDIR="$(pwd)/.tmp"
export CDK_OUTDIR="$(pwd)/cdk.out"

print_status "Using local temp directory: $(pwd)/.tmp"
print_status "CDK output directory: $(pwd)/cdk.out"

# Run CDK with all arguments passed to this script
