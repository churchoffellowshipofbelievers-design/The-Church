#!/bin/bash

# Firecrawl Installation Script for Christian Fellowship Website
# This script installs Firecrawl and sets up the project dependencies

echo "🔥 Installing Firecrawl for Christian Fellowship Website..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo "   Node.js version: $(node --version)"
echo "   npm version: $(npm --version)"

# Install project dependencies
echo ""
echo "📦 Installing project dependencies..."
npm install

# Check if Firecrawl was installed
if npm list firecrawl &> /dev/null; then
    echo "✅ Firecrawl installed successfully"
else
    echo "⚠️  Firecrawl package not found in npm registry"
    echo "   This is expected as Firecrawl is a service, not an npm package"
fi

# Create environment file template
echo ""
echo "🔧 Creating environment configuration..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Environment Variables for Christian Fellowship Website
# Copy this file to .env.local and fill in your actual API keys

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Bible API Configuration
BIBLE_API_KEY=your_bible_api_key_here

# Firecrawl Configuration
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Optional: Custom Firecrawl settings
FIRECRAWL_MAX_PAGES=20
FIRECRAWL_MAX_DEPTH=3
FIRECRAWL_RATE_LIMIT=1000
EOF
    echo "✅ Created .env template file"
else
    echo "⚠️  .env file already exists"
fi

# Create Firecrawl configuration file
echo ""
echo "⚙️  Setting up Firecrawl configuration..."

# Check if firecrawl-config.js exists
if [ -f firecrawl-config.js ]; then
    echo "✅ Firecrawl configuration file exists"
else
    echo "❌ Firecrawl configuration file not found"
    echo "   Please ensure firecrawl-config.js is in the project root"
fi

# Display setup instructions
echo ""
echo "🎯 Setup Instructions:"
echo "====================="
echo ""
echo "1. Get your Firecrawl API key:"
echo "   - Visit: https://firecrawl.dev/"
echo "   - Sign up for a free account"
echo "   - Get your API key from the dashboard"
echo ""
echo "2. Update your API keys:"
echo "   - Edit .env file with your actual API keys"
echo "   - Replace 'YOUR_FIRECRAWL_API_KEY' in firecrawl-config.js"
echo ""
echo "3. Test the installation:"
echo "   - Run: npm run dev"
echo "   - Open the website in your browser"
echo "   - Click 'Load Resources' in the Scripture Study section"
echo ""
echo "4. API Rate Limits (Free Tier):"
echo "   - 10 requests per minute"
echo "   - 100 requests per hour"
echo "   - 1000 requests per day"
echo ""

# Check if the website files exist
echo "📁 Checking project files..."
required_files=("index.html" "styles.css" "script.js" "firecrawl-config.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo ""
    echo "🎉 All required files are present!"
    echo "   Your Christian Fellowship Website is ready to use with Firecrawl!"
else
    echo ""
    echo "⚠️  Some required files are missing:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo "   Please ensure all files are in the project directory"
fi

echo ""
echo "🚀 Installation complete!"
echo "   Run 'npm run dev' to start the development server"
echo "   Visit your website and test the Firecrawl integration"
echo ""
echo "📚 For more information:"
echo "   - Firecrawl Docs: https://docs.firecrawl.dev/"
echo "   - Project README: README.md"
echo "   - Configuration: firecrawl-config.js"
echo ""
echo "🙏 May your Christian fellowship website bless many lives!"
