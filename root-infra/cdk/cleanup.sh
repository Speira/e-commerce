#!/bin/bash

# CDK Cleanup Script
# This script cleans up CDK temporary files and frees up disk space

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

# Function to check disk space
check_disk_space() {
    print_status "Checking disk space before cleanup..."
    
    if command -v df >/dev/null 2>&1; then
        local before_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
        local before_available=$(df -h . | tail -1 | awk '{print $4}')
        
        echo "💾 Before cleanup: ${before_usage}% used, ${before_available} available"
        
        # Store for comparison
        echo "$before_usage" > /tmp/before_usage
        echo "$before_available" > /tmp/before_available
    else
        print_warning "df command not available, cannot check disk space"
    fi
}

# Function to show CDK temporary files
show_cdk_files() {
    print_status "Scanning for CDK temporary files..."
    
    local cdk_out_dirs=$(find /tmp -name "cdk.out*" -type d 2>/dev/null | wc -l)
    local cdk_custom_dirs=$(find /tmp -name "cdk-custom-resource*" -type d 2>/dev/null | wc -l)
    local total_dirs=$((cdk_out_dirs + cdk_custom_dirs))
    
    if [ "$total_dirs" -gt 0 ]; then
        print_status "Found CDK temporary files:"
        echo "  📁 cdk.out* directories: $cdk_out_dirs"
        echo "  📁 cdk-custom-resource* directories: $cdk_custom_dirs"
        echo "  📁 Total: $total_dirs directories"
        
        # Show sizes if du is available
        if command -v du >/dev/null 2>&1; then
            echo ""
            echo "📊 Size breakdown:"
            
            if [ "$cdk_out_dirs" -gt 0 ]; then
                echo "  cdk.out* directories:"
                find /tmp -name "cdk.out*" -type d 2>/dev/null | head -10 | while read -r dir; do
                    local size=$(du -sh "$dir" 2>/dev/null || echo "unknown")
                    echo "    $dir: $size"
                done
            fi
            
            if [ "$cdk_custom_dirs" -gt 0 ]; then
                echo "  cdk-custom-resource* directories:"
                find /tmp -name "cdk-custom-resource*" -type d 2>/dev/null | head -10 | while read -r dir; do
                    local size=$(du -sh "$dir" 2>/dev/null || echo "unknown")
                    echo "    $dir: $size"
                done
            fi
        fi
    else
        print_success "No CDK temporary files found in /tmp"
    fi
    
    # Check local cdk.out directory
    if [ -d "cdk.out" ]; then
        local local_size=$(du -sh cdk.out 2>/dev/null || echo "unknown")
        print_status "Local cdk.out directory: $local_size"
    else
        print_success "No local cdk.out directory found"
    fi
}

# Function to clean up CDK files
cleanup_cdk_files() {
    print_status "Starting cleanup process..."
    
    local cleaned_count=0
    local cleaned_size=0
    
    # Clean local cdk.out directory
    if [ -d "cdk.out" ]; then
        local size=$(du -sb cdk.out 2>/dev/null | cut -f1 || echo "0")
        rm -rf cdk.out
        print_success "Local cdk.out directory removed"
        cleaned_count=$((cleaned_count + 1))
        cleaned_size=$((cleaned_size + size))
    fi
    
    # Clean Jest cache
    if [ -d ".jest-cache" ]; then
        local size=$(du -sb .jest-cache 2>/dev/null | cut -f1 || echo "0")
        rm -rf .jest-cache
        print_success "Jest cache removed"
        cleaned_count=$((cleaned_count + 1))
        cleaned_size=$((cleaned_size + size))
    fi
    
    # Clean coverage directory
    if [ -d "coverage" ]; then
        local size=$(du -sb coverage 2>/dev/null | cut -f1 || echo "0")
        rm -rf coverage
        print_success "Coverage directory removed"
        cleaned_count=$((cleaned_count + 1))
        cleaned_size=$((cleaned_size + size))
    fi
    
    # Clean /tmp CDK files
    local tmp_cleaned=0
    if command -v sudo >/dev/null 2>&1; then
        print_status "Cleaning /tmp CDK files with sudo..."
        
        # Count files before cleanup
        local before_count=$(find /tmp -name "cdk*" -type d 2>/dev/null | wc -l)
        
        if sudo rm -rf /tmp/cdk* /tmp/cdk-custom-resource* 2>/dev/null; then
            local after_count=$(find /tmp -name "cdk*" -type d 2>/dev/null | wc -l)
            tmp_cleaned=$((before_count - after_count))
            print_success "Removed $tmp_cleaned CDK temporary directories from /tmp"
        else
            print_warning "Could not remove all CDtmp CDK files with sudo"
        fi
    else
        print_warning "sudo not available, cannot clean /tmp CDK files"
        print_warning "You may need to manually clean: sudo rm -rf /tmp/cdk*"
    fi
    
    # Show cleanup summary
    if [ "$cleaned_count" -gt 0 ] || [ "$tmp_cleaned" -gt 0 ]; then
        print_success "Cleanup completed!"
        echo "  📁 Local directories cleaned: $cleaned_count"
        echo "  📁 /tmp directories cleaned: $tmp_cleaned"
        
        if [ "$cleaned_size" -gt 0 ]; then
            local cleaned_mb=$((cleaned_size / 1024 / 1024))
            echo "  💾 Local space freed: ~${cleaned_mb}MB"
        fi
    else
        print_status "No cleanup needed - all directories were already clean"
    fi
}

# Function to check disk space after cleanup
check_disk_space_after() {
    print_status "Checking disk space after cleanup..."
    
    if command -v df >/dev/null 2>&1; then
        local after_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
        local after_available=$(df -h . | tail -1 | awk '{print $4}')
        
        echo "💾 After cleanup: ${after_usage}% used, ${after_available} available"
        
        # Compare with before if available
        if [ -f /tmp/before_usage ] && [ -f /tmp/before_available ]; then
            local before_usage=$(cat /tmp/before_usage)
            local before_available=$(cat /tmp/before_available)
            
            echo "📊 Comparison:"
            echo "  Before: ${before_usage}% used, ${before_available} available"
            echo "  After:  ${after_usage}% used, ${after_available} available"
            
            # Clean up temporary files
            rm -f /tmp/before_usage /tmp/before_available
        fi
    fi
}

# Function to show remaining CDK files
show_remaining_files() {
    print_status "Checking for remaining CDK files..."
    
    local remaining_cdk_out=$(find /tmp -name "cdk.out*" -type d 2>/dev/null | wc -l)
    local remaining_custom=$(find /tmp -name "cdk-custom-resource*" -type d 2>/dev/null | wc -l)
    local total_remaining=$((remaining_cdk_out + remaining_custom))
    
    if [ "$total_remaining" -gt 0 ]; then
        print_warning "Still $total_remaining CDK temporary directories remaining:"
        echo "  📁 cdk.out*: $remaining_cdk_out"
        echo "  📁 cdk-custom-resource*: $remaining_custom"
        
        if [ "$remaining_cdk_out" -gt 0 ]; then
            echo ""
            echo "Remaining cdk.out* directories:"
            find /tmp -name "cdk.out*" -type d 2>/dev/null | head -5
            if [ "$remaining_cdk_out" -gt 5 ]; then
                echo "  ... and $((remaining_cdk_out - 5)) more"
            fi
        fi
        
        if [ "$remaining_custom" -gt 0 ]; then
            echo ""
            echo "Remaining cdk-custom-resource* directories:"
            find /tmp -name "cdk-custom-resource*" -type d 2>/dev/null | head -5
            if [ "$remaining_custom" -gt 5 ]; then
                echo "  ... and $((remaining_custom - 5)) more"
            fi
        fi
        
        echo ""
        print_warning "You may need to clean these manually:"
        echo "  sudo rm -rf /tmp/cdk* /tmp/cdk-custom-resource*"
    else
        print_success "All CDK temporary files have been cleaned up!"
    fi
}

# Main execution
main() {
    echo "🧹 CDK Cleanup Script"
    echo "====================="
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "This script should be run from a directory containing package.json"
        print_error "Current directory: $(pwd)"
        exit 1
    fi
    
    # Run cleanup process
    check_disk_space
    show_cdk_files
    cleanup_cdk_files
    check_disk_space_after
    show_remaining_files
    
    echo ""
    print_success "Cleanup process completed!"
    print_status "You can now run tests without disk space issues"
}

# Handle script arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  (no args)  - Run full cleanup process"
        echo "  help       - Show this help message"
        echo ""
        echo "This script will:"
        echo "  - Check current disk space"
        echo "  - Scan for CDK temporary files"
        echo "  - Clean local cdk.out, .jest-cache, and coverage directories"
        echo "  - Clean /tmp/cdk* and /tmp/cdk-custom-resource* directories (with sudo)"
        echo "  - Show cleanup results and remaining files"
        echo ""
        echo "Note: sudo access is required to clean /tmp directories"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
