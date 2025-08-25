#!/bin/bash

# 🎉 All-in-One Christian Fellowship Website Setup
# This script does EVERYTHING for your website!

clear

echo "🙏 =================================================="
echo "   Christian Fellowship Website - ALL-IN-ONE SETUP"
echo "   Complete Database + Website Integration"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Success/Error functions
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
step() { echo -e "${CYAN}🚀 $1${NC}"; }
title() { echo -e "${MAGENTA}${BOLD}🙏 $1${NC}"; }

# Check requirements
check_requirements() {
    local missing=()
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing+=("Node.js (install from https://nodejs.org/)")
    fi
    
    # Check required files
    local files=("index.html" "script.js" "styles.css" "supabase-config.js" "setup-complete.js")
    for file in "${files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing+=("$file")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Missing requirements:"
        for item in "${missing[@]}"; do
            echo "   - $item"
        done
        echo ""
        echo "Make sure you're in the correct project directory and have Node.js installed."
        exit 1
    fi
    
    success "All requirements satisfied"
}

# Make setup executable
prepare_setup() {
    chmod +x setup-complete.js
    success "Setup script prepared"
}

# Main execution
main() {
    title "Welcome to the All-in-One Fellowship Website Setup!"
    echo ""
    echo "🎯 This script will set up your COMPLETE Christian fellowship website:"
    echo ""
    echo "   📊 Database Features:"
    echo "   • Complete Supabase database (12 tables)"
    echo "   • User authentication & profiles"
    echo "   • Fellowship group management"
    echo "   • Community prayer wall"
    echo "   • Bible study session tracking"
    echo "   • Event coordination system"
    echo "   • Personal spiritual growth dashboard"
    echo ""
    echo "   🌐 Website Features:"
    echo "   • Updates your existing website files"
    echo "   • Connects all APIs and database"
    echo "   • Configures authentication system"
    echo "   • Tests everything works perfectly"
    echo "   • Sample data for immediate testing"
    echo ""
    echo "   ⏱️  Total time: ~10-15 minutes"
    echo "   🎓 Skill level: Beginner friendly"
    echo "   📋 What you need: Supabase account (free)"
    echo ""
    
    read -p "🚀 Ready to set up your complete fellowship platform? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        step "Starting complete setup..."
        echo ""
        
        # Check requirements
        check_requirements
        prepare_setup
        
        # Run the complete setup
        node setup-complete.js
        
        echo ""
        if [[ $? -eq 0 ]]; then
            success "🎉 Complete setup finished successfully!"
            echo ""
            title "Your Christian Fellowship Website is Ready!"
            echo ""
            echo "🚀 Next steps:"
            echo "   1. Run: npm run dev"
            echo "   2. Open: http://localhost:3000"
            echo "   3. Test all features"
            echo "   4. Invite your community!"
            echo ""
        else
            error "Setup encountered some issues"
            echo "Check the messages above for troubleshooting steps"
        fi
    else
        warning "Setup cancelled by user"
        echo "Run this script again when you're ready to set up your fellowship platform!"
    fi
}

# Handle interruption
trap 'echo ""; warning "Setup interrupted"; exit 1' INT

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi