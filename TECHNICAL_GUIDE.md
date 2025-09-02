# Technical Implementation Guide
## The Church - Fellowship of the Believers

### Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Best Practices](#best-practices)
6. [Performance Optimization](#performance-optimization)
7. [SEO Implementation](#seo-implementation)
8. [Security Guidelines](#security-guidelines)
9. [Deployment Guide](#deployment-guide)
10. [Monitoring & Analytics](#monitoring--analytics)

---

## Architecture Overview

### Updated System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │────│ Vercel CDN/Edge │────│ Next.js App     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                        ┌─────────────────┐             │
                        │ GitHub Actions  │─────────────┤
                        │   (CI/CD)       │             │
                        └─────────────────┘             │
                                                        │
        ┌─────────────────────────────────────────────────┼─────────────────┐
        │                                                 │                 │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Supabase      │  │   Bible APIs    │  │   FireCrawl     │  │   Content       │
│  (Database,     │  │  (ESV, Bible    │  │  (Web Scraper)  │  │  (Markdown/MDX) │
│   Auth, RT)     │  │   Gateway, etc) │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Enhanced Design Principles
- **Full-Stack Architecture**: Next.js frontend with Supabase backend
- **Real-time Features**: Live chat and community interactions
- **API-First Design**: Extensible with multiple Bible and content APIs
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Mobile-First**: Responsive design optimized for fellowship on-the-go
- **Accessibility-First**: WCAG 2.1 AA compliance with screen reader support
- **Security-First**: Authentication, authorization, and data protection

---

## Technology Stack

### Core Framework
```json
{
  "framework": "Next.js 14+",
  "rendering": "SSG + SSR with App Router",
  "routing": "App Router with Parallel Routes",
  "typescript": "Yes (strict mode)",
  "reactVersion": "18+",
  "deployment": "Vercel with Edge Functions"
}
```

### Backend & Database (Supabase)
```json
{
  "database": "PostgreSQL with Row Level Security",
  "authentication": "Supabase Auth (Email, OAuth)",
  "realtime": "Supabase Realtime (WebSockets)",
  "storage": "Supabase Storage for files",
  "edgeFunctions": "Supabase Edge Functions (Deno)",
  "client": "@supabase/supabase-js"
}
```

### Bible APIs & Content Enhancement
```json
{
  "bibleAPIs": {
    "esv": "ESV API (free tier: 5000 requests/day)",
    "bibleApi": "Bible-API.com (free, unlimited)",
    "bibleBrain": "Bible Brain API (audio versions)",
    "youVersion": "YouVersion API (reading plans)",
    "bibleGateway": "Bible Gateway API (commentaries)"
  },
  "contentScraping": "FireCrawl API (500 pages/month free)",
  "contentProcessing": "Next-MDX-Remote with remark/rehype"
}
```

### Styling & UI
```json
{
  "css": "Tailwind CSS with custom biblical theme",
  "components": "Radix UI for accessible primitives",
  "icons": "Lucide React + custom biblical icons",
  "fonts": "Next.js Font Optimization (Inter + serif)",
  "animations": "Framer Motion for smooth interactions"
}
```

### Development Tools & CI/CD
```json
{
  "versionControl": "GitHub with Issues & Projects",
  "cicd": "GitHub Actions for deployment",
  "packageManager": "pnpm (faster installs)",
  "linting": "ESLint + Prettier + TypeScript",
  "testing": "Jest + React Testing Library + Playwright",
  "monitoring": "Vercel Analytics + Sentry error tracking"
}
```

---

## Development Setup

### Prerequisites
- Node.js 18+ LTS
- npm/yarn/pnpm
- Git
- VS Code (recommended)

### Initial Setup
```bash
# Create Next.js project with TypeScript and Tailwind
npx create-next-app@latest the-church --typescript --tailwind --eslint --app

# Navigate to project
cd the-church

# Install Supabase and authentication
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Install UI components and icons
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react framer-motion

# Install content processing
npm install @next/mdx @mdx-js/loader @mdx-js/react next-mdx-remote
npm install gray-matter reading-time

# Install Bible APIs and FireCrawl
npm install axios # for API calls

# Development dependencies
npm install --save-dev @types/mdx prettier husky lint-staged
npm install --save-dev @playwright/test # for e2e testing
```

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="The Church"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Bible APIs
ESV_API_KEY=your-esv-api-key
BIBLE_GATEWAY_API_KEY=your-bible-gateway-key

# FireCrawl API
FIRECRAWL_API_KEY=your-firecrawl-api-key

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Supabase Database Setup
```sql
-- Create user profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  fellowship_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fellowship events table
CREATE TABLE fellowship_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prayer requests table
CREATE TABLE prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table for fellowship
CREATE TABLE fellowship_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES fellowship_events(id),
  message TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for security
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### VS Code Configuration
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["classnames\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Project Structure

```
the-church/
├── public/                          # Static assets
│   ├── icons/                       # Favicons and app icons
│   ├── images/                      # Optimized images
│   └── manifest.json               # PWA manifest
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage
│   │   ├── about/                  # About section
│   │   ├── fellowship/             # Fellowship content
│   │   ├── priesthood/             # Priesthood teachings
│   │   ├── worship/                # Worship principles
│   │   ├── leadership/             # Leadership guidelines
│   │   └── community/              # Community resources
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # Basic UI components
│   │   ├── layout/                 # Layout components
│   │   └── content/                # Content-specific components
│   ├── content/                    # Markdown content
│   │   ├── articles/               # Main articles
│   │   ├── studies/                # Bible studies
│   │   └── resources/              # Downloadable resources
│   ├── lib/                        # Utility libraries
│   │   ├── utils.ts                # Helper functions
│   │   ├── mdx.ts                  # MDX processing
│   │   └── constants.ts            # App constants
│   └── types/                      # TypeScript definitions
├── docs/                           # Documentation
├── tests/                          # Test files
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
└── package.json                    # Dependencies and scripts
```

---

## Best Practices

### Code Organization

#### Component Structure
```tsx
// components/ui/Button.tsx
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

interface ButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

#### Content Processing
```tsx
// lib/mdx.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

export interface ContentFrontmatter {
  title: string
  description: string
  date: string
  author: string
  scripture?: string[]
  category: string
  tags?: string[]
  featured?: boolean
}

export async function getContentBySlug(slug: string, contentType: string) {
  const contentDirectory = path.join(process.cwd(), 'src/content', contentType)
  const filePath = path.join(contentDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: []
    }
  })

  return {
    frontmatter: data as ContentFrontmatter,
    content: mdxSource,
    slug
  }
}
```

### TypeScript Best Practices

#### Type Definitions
```tsx
// types/index.ts
export interface Article {
  slug: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  updatedAt?: string
  category: ArticleCategory
  tags: string[]
  scripture: ScriptureReference[]
  featured: boolean
  readingTime: number
}

export interface ScriptureReference {
  book: string
  chapter: number
  verses: string
  translation: string
  text: string
}

export type ArticleCategory = 
  | 'fellowship'
  | 'priesthood'
  | 'worship'
  | 'leadership'
  | 'community'
```

### Accessibility Implementation

#### ARIA Labels and Semantic HTML
```tsx
// components/layout/Navigation.tsx
export function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul role="list">
        <li>
          <Link 
            href="/fellowship"
            aria-current={pathname === '/fellowship' ? 'page' : undefined}
          >
            Fellowship
          </Link>
        </li>
        <li>
          <Link 
            href="/priesthood"
            aria-current={pathname === '/priesthood' ? 'page' : undefined}
          >
            Priesthood
          </Link>
        </li>
      </ul>
    </nav>
  )
}
```

#### Skip Links
```tsx
// components/layout/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 rounded-br-md z-50"
    >
      Skip to main content
    </a>
  )
}
```

---

## Performance Optimization

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: []
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Image Optimization
```tsx
// components/ui/OptimizedImage.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false
}: OptimizedImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

### Bundle Optimization
```javascript
// Bundle analysis script in package.json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build",
    "build:analyze": "npm run build && npm run analyze"
  }
}

// Install bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

---

## SEO Implementation

### Meta Tags and SEO
```tsx
// components/seo/SEOHead.tsx
import Head from 'next/head'
import { DefaultSeo, ArticleJsonLd } from 'next-seo'

interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  openGraph?: {
    title: string
    description: string
    images: Array<{
      url: string
      width: number
      height: number
      alt: string
    }>
  }
}

export function SEOHead({ title, description, canonicalUrl, openGraph }: SEOProps) {
  const siteTitle = title ? `${title} | The Church` : 'The Church - New Testament Fellowship'
  
  return (
    <>
      <DefaultSeo
        title={siteTitle}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: canonicalUrl,
          site_name: 'The Church',
          ...openGraph
        }}
        twitter={{
          handle: '@thechurch',
          site: '@thechurch',
          cardType: 'summary_large_image'
        }}
      />
    </>
  )
}
```

### Structured Data
```tsx
// components/seo/StructuredData.tsx
import { ArticleJsonLd, BreadcrumbJsonLd } from 'next-seo'

interface ArticleStructuredDataProps {
  title: string
  description: string
  publishedTime: string
  modifiedTime?: string
  authorName: string
  url: string
  images: string[]
}

export function ArticleStructuredData({
  title,
  description,
  publishedTime,
  modifiedTime,
  authorName,
  url,
  images
}: ArticleStructuredDataProps) {
  return (
    <ArticleJsonLd
      url={url}
      title={title}
      images={images}
      datePublished={publishedTime}
      dateModified={modifiedTime || publishedTime}
      authorName={[authorName]}
      publisherName="The Church"
      publisherLogo="https://yoursite.com/logo.png"
      description={description}
    />
  )
}
```

---

## Security Guidelines

### Content Security Policy
```javascript
// next.config.js security headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      connect-src 'self' *.vercel-insights.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

### Input Validation
```tsx
// lib/validation.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000)
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

---

## Deployment Guide

### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/*/route.ts": {
      "maxDuration": 10
    }
  }
}
```

### Build Scripts
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "sitemap": "next-sitemap"
  }
}
```

### Environment Variables
```bash
# Production environment variables
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_NAME="The Church"
```

---

## Monitoring & Analytics

### Performance Monitoring
```tsx
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // })
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}
```

### Error Tracking
```tsx
// lib/error-tracking.ts
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    console.error('Application Error:', error, context)
  } else {
    console.error('Development Error:', error, context)
  }
}
```

---

## Testing Strategy

### Component Testing
```tsx
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Content Validation
```tsx
// __tests__/content/articles.test.ts
import { getAllArticles } from '@/lib/content'

describe('Article Content', () => {
  it('all articles have required frontmatter', async () => {
    const articles = await getAllArticles()
    
    articles.forEach(article => {
      expect(article.title).toBeTruthy()
      expect(article.description).toBeTruthy()
      expect(article.author).toBeTruthy()
      expect(article.publishedAt).toBeTruthy()
      expect(article.category).toBeTruthy()
    })
  })

  it('scripture references are properly formatted', async () => {
    const articles = await getAllArticles()
    
    articles.forEach(article => {
      if (article.scripture) {
        article.scripture.forEach(ref => {
          expect(ref.book).toBeTruthy()
          expect(ref.chapter).toBeGreaterThan(0)
          expect(ref.verses).toBeTruthy()
        })
      }
    })
  })
})
```

This technical guide provides a comprehensive foundation for building a performant, accessible, and maintainable New Testament fellowship website. All recommendations follow modern web development best practices while keeping the focus on biblical content and community building.