#!/bin/bash

# Test runner script for e-commerce infrastructure
# This script runs all tests with different configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check disk space
check_disk_space() {
    print_status "Checking disk space..."
    
    if command_exists df; then
        local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
        local available_space=$(df -h . | tail -1 | awk '{print $4}')
        
        echo "💾 Available disk space: $available_space"
        
        if [ "$disk_usage" -gt 80 ]; then
            print_warning "High disk usage detected: ${disk_usage}%"
            print_warning "Consider cleaning up temporary files before running tests"
        else
            print_success "Disk space looks good: ${disk_usage}% used"
        fi
    else
        print_warning "Could not check disk space (df command not available)"
    fi
}

# Function to clean up CDK temporary files
cleanup_cdk_files() {
    print_status "Cleaning up CDK temporary files..."
    
    # Clean CDK output directory
    if [ -d "cdk.out" ]; then
        rm -rf cdk.out
        print_success "CDK output directory removed"
    fi
    
    # Clean Jest cache
    if [ -d ".jest-cache" ]; then
        rm -rf .jest-cache
        print_success "Jest cache removed"
    fi
    
    # Clean coverage directory
    if [ -d "coverage" ]; then
        rm -rf coverage
        print_success "Coverage directory removed"
    fi
    
    # Note: .tmp directory is kept for CDK operations
    
    # Clean node_modules/.cache (where some tools store temp files)
    if [ -d "node_modules/.cache" ]; then
        rm -rf node_modules/.cache
        print_success "Node modules cache removed"
    fi
    
    # Note about system temp files
    print_status "Note: CDK may create temp files in system temp directory"
    print_status "These are automatically cleaned by the OS or on reboot"
}

# Function to show disk usage breakdown
show_disk_usage() {
    print_status "Current disk usage breakdown:"
    
    if command_exists du; then
        echo "📁 Current directory:"
        du -sh . 2>/dev/null || echo "  Could not determine size"
        
        echo "📁 CDK output:"
        if [ -d "cdk.out" ]; then
            du -sh cdk.out 2>/dev/null || echo "  Could not determine size"
        else
            echo "  Not present"
        fi
        
        echo "📁 Node modules:"
        if [ -d "node_modules" ]; then
            du -sh node_modules 2>/dev/null || echo "  Could not determine size"
        else
            echo "  Not present"
        fi
        
        echo "📁 Lambda functions:"
        if [ -d "lambda" ]; then
            du -sh lambda 2>/dev/null || echo "  Could not determine size"
        else
            echo "  Not present"
        fi
    else
        print_warning "du command not available, cannot show disk usage breakdown"
    fi
}

# Setup environment for CDK
setup_cdk_environment() {
    print_status "Setting up CDK environment..."
    
    # Create local temp directory
    mkdir -p .tmp
    
    # Set environment variables for CDK
    export TMPDIR="$(pwd)/.tmp"
    export CDK_OUTDIR="$(pwd)/cdk.out"
    
    print_success "CDK environment configured (using local .tmp directory)"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists pnpm; then
        print_error "pnpm is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        pnpm install
    else
        print_warning "Dependencies already installed, skipping..."
    fi
    
    print_success "Dependencies installed"
}

# Run tests with different configurations
run_tests() {
    local test_type=$1
    
    case $test_type in
        "all")
            print_status "Running all tests..."
            pnpm test
            ;;
        "watch")
            print_status "Running tests in watch mode..."
            pnpm run test:watch
            ;;
        "coverage")
            print_status "Running tests with coverage..."
            pnpm run test:coverage
            ;;
        "verbose")
            print_status "Running tests with verbose output..."
            pnpm run test:verbose
            ;;
        "ci")
            print_status "Running tests for CI/CD..."
            pnpm run test:ci
            ;;
        "unit")
            print_status "Running unit tests only..."
            pnpm run test:unit
            ;;
        "integration")
            print_status "Running integration tests only..."
            pnpm run test:integration
            ;;
        "snapshot")
            print_status "Running snapshot tests..."
            pnpm run test:snapshot
            ;;
        "snapshot:update")
            print_status "Updating snapshot tests..."
            pnpm run test:snapshot:update
            ;;
        *)
            print_error "Unknown test type: $test_type"
            print_status "Available options: all, watch, coverage, verbose, ci, unit, integration, snapshot, snapshot:update"
            exit 1
            ;;
    esac
}

# Show test coverage summary
show_coverage_summary() {
    if [ -f "coverage/lcov-report/index.html" ]; then
        print_status "Coverage report generated at: coverage/lcov-report/index.html"
        
        # Extract coverage summary from lcov.info
        if [ -f "coverage/lcov.info" ]; then
            local total_lines=$(grep -c "LF:" coverage/lcov.info || echo "0")
            local covered_lines=$(grep -c "LH:" coverage/lcov.info || echo "0")
            
            if [ "$total_lines" -gt 0 ]; then
                local coverage_percent=$((covered_lines * 100 / total_lines))
                print_status "Coverage: $covered_lines/$total_lines lines ($coverage_percent%)"
            fi
        fi
    fi
}

# Clean up test artifacts
cleanup() {
    print_status "Cleaning up test artifacts..."
    
    # Remove coverage directory if it exists
    if [ -d "coverage" ]; then
        rm -rf coverage
        print_success "Coverage directory removed"
    fi
    
    # Remove test cache
    if [ -d ".jest-cache" ]; then
        rm -rf .jest-cache
        print_success "Jest cache removed"
    fi
}

# Main execution
main() {
    local test_type=${1:-"all"}
    
    print_status "Starting test execution..."
    print_status "Test type: $test_type"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "jest.config.js" ]; then
        print_error "This script must be run from the CDK directory"
        exit 1
    fi
    
    # Check disk space first
    check_disk_space
    
    # Show current disk usage
    show_disk_usage
    
    check_prerequisites
    install_dependencies
    
    # Setup CDK environment
    setup_cdk_environment
    
    # Clean up before running tests (but keep .tmp)
    cleanup_cdk_files
    
    # Run tests
    run_tests "$test_type"
    
    # Show coverage summary if coverage was generated
    if [ "$test_type" = "coverage" ] || [ "$test_type" = "ci" ]; then
        show_coverage_summary
    fi
    
    # Clean up after tests
    cleanup
    
    # Final disk space check
    check_disk_space
    
    print_success "Test execution completed!"
}

# Handle script arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Usage: $0 [test_type]"
        echo ""
        echo "Test types:"
        echo "  all             - Run all tests once (default)"
        echo "  watch           - Run tests in watch mode"
        echo "  coverage        - Run tests with coverage report"
        echo "  verbose         - Run tests with verbose output"
        echo "  ci              - Run tests for CI/CD (with coverage)"
        echo "  unit            - Run unit tests only"
        echo "  integration     - Run integration tests only"
        echo "  snapshot        - Run snapshot tests only"
        echo "  snapshot:update - Update snapshot tests"
        echo "  help            - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Run all tests"
        echo "  $0 coverage     # Run tests with coverage"
        echo "  $0 watch        # Run tests in watch mode"
        echo ""
        echo "Additional features:"
        echo "  - Automatic CDK temporary file cleanup"
        echo "  - Disk space monitoring"
        echo "  - Dependency management"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
