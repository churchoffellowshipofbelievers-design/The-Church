#!/bin/bash

# 🤖 One-Click Supabase Database Setup
# Christian Fellowship Website Automated Setup

clear

echo "🙏 =============================================="
echo "   Christian Fellowship Website Database Setup"
echo "   Automated Supabase Configuration"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Success/Error functions
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
step() { echo -e "${CYAN}🚀 $1${NC}"; }

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
    success "Node.js is installed: $(node --version)"
}

# Check if required files exist
check_files() {
    local missing_files=()
    
    files=("supabase-database-setup.sql" "supabase-security-policies.sql" "supabase-sample-data.sql" "setup-supabase-auto.js")
    
    for file in "${files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        error "Missing required files:"
        for file in "${missing_files[@]}"; do
            echo "   - $file"
        done
        exit 1
    fi
    
    success "All required files are present"
}

# Make setup script executable
make_executable() {
    chmod +x setup-supabase-auto.js
    success "Setup script is ready"
}

# Run the automated setup
run_setup() {
    step "Starting automated Supabase setup..."
    echo ""
    
    # Run the Node.js setup script
    node setup-supabase-auto.js
}

# Main execution
main() {
    echo "🔍 Pre-flight checks..."
    check_node
    check_files
    make_executable
    
    echo ""
    echo "🎯 What this script will do:"
    echo "   1. Collect your Supabase credentials"
    echo "   2. Create environment configuration"
    echo "   3. Guide you through database setup"
    echo "   4. Test the connection"
    echo "   5. Show you next steps"
    echo ""
    
    read -p "Ready to start? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_setup
    else
        warning "Setup cancelled by user"
        echo "Run this script again when you're ready!"
    fi
}

# Handle script interruption
trap 'echo ""; warning "Setup interrupted"; exit 1' INT

# Check if script is being sourced or executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi