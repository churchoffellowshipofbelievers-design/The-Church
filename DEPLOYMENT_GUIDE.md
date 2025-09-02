# Deployment & Maintenance Guide
## The Church - New Testament Fellowship Website

### Table of Contents
1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Hosting Platforms](#hosting-platforms)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Domain & SSL Configuration](#domain--ssl-configuration)
6. [Performance Monitoring](#performance-monitoring)
7. [Maintenance Procedures](#maintenance-procedures)
8. [Backup & Recovery](#backup--recovery)
9. [Security Maintenance](#security-maintenance)
10. [Content Management](#content-management)

---

## Deployment Overview

### Deployment Strategy
- **Static Site Generation (SSG)**: Pre-built HTML for optimal performance
- **Global CDN**: Fast content delivery worldwide
- **Atomic Deployments**: All-or-nothing deployments to prevent broken states
- **Preview Deployments**: Test changes before going live
- **Rollback Capability**: Quick recovery from issues

### Deployment Flow
```
Local Development → Git Push → CI/CD Pipeline → Build → Deploy → Verify
```

---

## Environment Setup

### Environment Types

#### Development Environment
```bash
# .env.local (Development)
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="The Church - Dev"
NEXT_PUBLIC_ANALYTICS_ID=""
```

#### Staging Environment
```bash
# .env.staging
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://staging.thechurch.example.com
NEXT_PUBLIC_SITE_NAME="The Church - Staging"
NEXT_PUBLIC_ANALYTICS_ID="G-STAGING123"
```

#### Production Environment
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://thechurch.example.com
NEXT_PUBLIC_SITE_NAME="The Church"
NEXT_PUBLIC_ANALYTICS_ID="G-PRODUCTION123"
CONTACT_EMAIL=contact@thechurch.example.com
```

### Environment-Specific Configuration

#### Next.js Configuration
```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production'
const isStaging = process.env.VERCEL_ENV === 'preview'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Analytics only in production
  analyticsId: isProd ? process.env.NEXT_PUBLIC_ANALYTICS_ID : undefined,
  
  // Sitemap generation
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      }
    ]
  },

  // Security headers
  async headers() {
    const headers = []
    
    if (isProd) {
      headers.push({
        source: '/(.*)',
        headers: securityHeaders,
      })
    }
    
    return headers
  }
}

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = nextConfig
```

---

## Hosting Platforms

### Primary Recommendation: Vercel

#### Advantages:
- Native Next.js support
- Automatic deployments from Git
- Global CDN with edge functions
- Preview deployments for pull requests
- Built-in analytics and performance monitoring

#### Vercel Setup:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set up production deployment
vercel --prod
```

#### Vercel Configuration:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1", "lhr1"],
  
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  },
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### Alternative: Netlify

#### Netlify Setup:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Netlify Configuration:
```toml
# netlify.toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

#### Deployment Workflow:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

#### Content Validation Workflow:
```yaml
# .github/workflows/content-validation.yml
name: Content Validation

on:
  pull_request:
    paths:
      - 'src/content/**'

jobs:
  validate-content:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate markdown content
        run: npm run validate-content

      - name: Check scripture references
        run: npm run check-scripture

      - name: Spell check content
        run: npm run spell-check
```

### Pre-deployment Checks

#### Automated Testing:
```json
// package.json scripts
{
  "scripts": {
    "validate-content": "node scripts/validate-content.js",
    "check-scripture": "node scripts/check-scripture.js",
    "spell-check": "cspell 'src/content/**/*.md'",
    "lighthouse": "lighthouse-ci autorun",
    "check-links": "markdown-link-check src/content/**/*.md"
  }
}
```

#### Content Validation Script:
```javascript
// scripts/validate-content.js
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const contentDir = path.join(process.cwd(), 'src/content')

function validateContent() {
  const files = getAllMarkdownFiles(contentDir)
  let hasErrors = false

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    const { data: frontmatter } = matter(content)

    // Required frontmatter fields
    const required = ['title', 'description', 'author', 'date', 'category']
    
    required.forEach(field => {
      if (!frontmatter[field]) {
        console.error(`Missing ${field} in ${file}`)
        hasErrors = true
      }
    })

    // Scripture references format validation
    if (frontmatter.scripture) {
      frontmatter.scripture.forEach(ref => {
        if (!isValidScriptureReference(ref)) {
          console.error(`Invalid scripture reference in ${file}: ${ref}`)
          hasErrors = true
        }
      })
    }
  })

  if (hasErrors) {
    process.exit(1)
  } else {
    console.log('All content validation passed!')
  }
}

function getAllMarkdownFiles(dir) {
  let files = []
  const items = fs.readdirSync(dir)

  items.forEach(item => {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath))
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      files.push(fullPath)
    }
  })

  return files
}

function isValidScriptureReference(ref) {
  // Basic validation for scripture references
  const pattern = /^[1-3]?\s?[A-Za-z]+\s\d+:\d+(-\d+)?$/
  return pattern.test(ref)
}

validateContent()
```

---

## Domain & SSL Configuration

### Domain Setup

#### DNS Configuration:
```
# DNS Records for production
Type    Name                Value                       TTL
A       @                   76.76.19.61                 300
A       www                 76.76.19.61                 300
CNAME   staging             staging-abc123.vercel.app   300
TXT     @                   "v=spf1 include:_spf.google.com ~all"
```

#### Custom Domain in Vercel:
1. Go to Project Settings → Domains
2. Add custom domain: `thechurch.example.com`
3. Add www redirect: `www.thechurch.example.com`
4. Verify DNS configuration
5. SSL certificate automatically provisioned

### SSL/TLS Configuration

#### Security Headers:
```javascript
// Security headers for production
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' *.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' *.vercel-insights.com;"
  }
]
```

---

## Performance Monitoring

### Core Web Vitals Monitoring

#### Web Vitals Tracking:
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

#### Performance Budget:
```javascript
// lighthouse-ci configuration
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/fellowship',
        'http://localhost:3000/priesthood'
      ]
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}]
      }
    }
  }
}
```

### Monitoring Dashboard

#### Key Metrics to Track:
- **Performance**: Page load times, Core Web Vitals
- **Availability**: Uptime monitoring and alerts
- **User Experience**: Error rates, user flows
- **Content**: Page views, engagement metrics

#### Monitoring Tools:
```javascript
// lib/monitoring.ts
export async function trackPageView(url: string) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_location: url
    })
  }
}

export async function trackEvent(eventName: string, parameters: any) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    gtag('event', eventName, parameters)
  }
}
```

---

## Maintenance Procedures

### Regular Maintenance Tasks

#### Weekly Tasks:
- [ ] Check website performance metrics
- [ ] Review error logs and fix critical issues
- [ ] Update content and publish new articles
- [ ] Monitor security alerts and updates

#### Monthly Tasks:
- [ ] Update dependencies and security patches
- [ ] Review analytics and performance reports
- [ ] Backup content and configuration files
- [ ] Test all forms and interactive features
- [ ] Review and update SEO optimizations

#### Quarterly Tasks:
- [ ] Comprehensive security audit
- [ ] Performance optimization review
- [ ] Content strategy evaluation
- [ ] User feedback analysis and improvements
- [ ] Disaster recovery testing

### Maintenance Checklist

#### Dependency Updates:
```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix security issues
npm audit fix

# Update Next.js specifically
npm install next@latest react@latest react-dom@latest
```

#### Content Maintenance:
```bash
# Validate all content
npm run validate-content

# Check for broken links
npm run check-links

# Optimize images
npm run optimize-images

# Update sitemap
npm run sitemap
```

---

## Backup & Recovery

### Backup Strategy

#### Content Backup:
```bash
#!/bin/bash
# scripts/backup-content.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="backups/$DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup content files
cp -r src/content $BACKUP_DIR/
cp -r public $BACKUP_DIR/

# Backup configuration files
cp package.json $BACKUP_DIR/
cp next.config.js $BACKUP_DIR/
cp tailwind.config.js $BACKUP_DIR/

# Create archive
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR/

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR.tar.gz s3://backup-bucket/

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

#### Automated Backup:
```yaml
# .github/workflows/backup.yml
name: Weekly Backup

on:
  schedule:
    - cron: '0 0 * * 0' # Every Sunday at midnight

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Create backup
        run: ./scripts/backup-content.sh

      - name: Upload to storage
        uses: actions/upload-artifact@v3
        with:
          name: content-backup-${{ github.run_number }}
          path: backups/
```

### Recovery Procedures

#### Quick Recovery Steps:
1. **Identify Issue**: Determine scope and impact
2. **Assess Damage**: Check what needs to be restored
3. **Restore from Backup**: Use most recent clean backup
4. **Verify Restoration**: Test all functionality
5. **Document Incident**: Record lessons learned

#### Rollback Process:
```bash
# Revert to previous deployment
vercel rollback

# Or restore from Git
git revert <commit-hash>
git push origin main
```

---

## Security Maintenance

### Security Monitoring

#### Regular Security Tasks:
- [ ] Monitor for dependency vulnerabilities
- [ ] Check for unusual traffic patterns
- [ ] Review access logs for suspicious activity
- [ ] Update security headers and configurations

#### Security Scanning:
```bash
# Dependency security audit
npm audit

# OWASP dependency check
dependency-check --project "The Church" --scan ./ --format HTML

# Static security analysis
semgrep --config=auto ./src
```

### Incident Response Plan

#### Security Incident Response:
1. **Detection**: Identify and assess the security issue
2. **Containment**: Limit damage and prevent spread
3. **Investigation**: Determine cause and scope
4. **Recovery**: Restore services and apply fixes
5. **Post-Incident**: Document and improve processes

#### Emergency Contacts:
- **Hosting Provider**: Vercel support
- **Domain Registrar**: Technical support
- **Development Team**: Primary and backup contacts
- **Content Team**: Review and approval team

---

## Content Management

### Content Publishing Workflow

#### Content Creation Process:
1. **Planning**: Topic selection and research
2. **Writing**: Draft creation with biblical references
3. **Review**: Theological and editorial review
4. **Approval**: Final approval for publication
5. **Publishing**: Deploy to production
6. **Promotion**: Share and announce new content

#### Content Update Process:
```bash
# Create content branch
git checkout -b content/new-article

# Add content files
git add src/content/articles/new-article.mdx

# Commit changes
git commit -m "Add article: New Testament Fellowship Principles"

# Push for review
git push origin content/new-article

# Create pull request for review
```

### Editorial Calendar Management

#### Content Scheduling:
```javascript
// scripts/content-scheduler.js
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function scheduleContent() {
  const contentDir = path.join(process.cwd(), 'src/content/articles')
  const files = fs.readdirSync(contentDir)
  
  const scheduledContent = []
  
  files.forEach(file => {
    const filePath = path.join(contentDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { data: frontmatter } = matter(content)
    
    if (frontmatter.publishDate && new Date(frontmatter.publishDate) > new Date()) {
      scheduledContent.push({
        file,
        title: frontmatter.title,
        publishDate: frontmatter.publishDate
      })
    }
  })
  
  console.log('Scheduled content:', scheduledContent)
  return scheduledContent
}

scheduleContent()
```

This comprehensive deployment and maintenance guide ensures your New Testament fellowship website remains secure, performant, and well-maintained throughout its lifecycle. Regular adherence to these procedures will help maintain the quality and reliability of your biblical community platform.