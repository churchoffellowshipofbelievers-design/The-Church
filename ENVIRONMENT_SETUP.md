# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="The Church - Fellowship of the Believers"

# Bible APIs (Free tiers)
ESV_API_KEY=your-esv-api-key
BIBLE_GATEWAY_API_KEY=your-bible-gateway-key

# FireCrawl API
FIRECRAWL_API_KEY=your-firecrawl-api-key

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon public key

## Getting Bible API Keys

### ESV API
1. Visit [esvapi.org](https://esvapi.org)
2. Sign up for a free API key
3. Add to your environment variables

### Bible Gateway API
1. Visit [biblegateway.com](https://biblegateway.com)
2. Sign up for API access
3. Add to your environment variables

## Getting FireCrawl API Key

1. Visit [firecrawl.dev](https://firecrawl.dev)
2. Sign up for free tier (500 pages/month)
3. Add to your environment variables

## Security Notes

- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly
- Use environment-specific files (.env.development, .env.production)
