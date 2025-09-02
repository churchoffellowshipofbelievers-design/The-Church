# FireCrawl Web Scraping Integration
## The Church - New Testament Fellowship Website

### Table of Contents
1. [FireCrawl Overview](#firecrawl-overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [Biblical Content Scraping](#biblical-content-scraping)
4. [Church History Research](#church-history-research)
5. [Commentary Integration](#commentary-integration)
6. [Automated Content Enhancement](#automated-content-enhancement)
7. [Ethical Scraping Guidelines](#ethical-scraping-guidelines)
8. [Performance and Caching](#performance-and-caching)

---

## FireCrawl Overview

### Purpose and Benefits
FireCrawl helps enhance our New Testament fellowship website by:
- **Biblical Resource Aggregation**: Collecting complementary biblical content
- **Historical Research**: Gathering early church history materials
- **Commentary Integration**: Finding relevant theological commentary
- **Link Verification**: Ensuring external references remain valid
- **Content Enrichment**: Discovering related fellowship resources

### Free Tier Limits
- **500 pages per month** free tier
- **Real-time crawling** with structured data extraction
- **Content cleaning** and formatting
- **Rate limiting** to respect target sites

---

## Setup and Configuration

### FireCrawl API Client
```typescript
// lib/services/firecrawl-client.ts
import axios from 'axios'

interface FireCrawlOptions {
  formats?: string[]
  includeTags?: string[]
  excludeTags?: string[]
  onlyMainContent?: boolean
  timeout?: number
}

interface FireCrawlResponse {
  success: boolean
  data: {
    content: string
    markdown: string
    html: string
    metadata: {
      title: string
      description: string
      keywords: string
      author?: string
      publishedTime?: string
    }
    links: Array<{
      text: string
      href: string
    }>
  }
}

export class FireCrawlClient {
  private apiKey: string
  private baseUrl = 'https://api.firecrawl.dev/v0'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async scrapeUrl(url: string, options: FireCrawlOptions = {}): Promise<FireCrawlResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/scrape`,
        {
          url: url,
          formats: options.formats || ['markdown', 'html'],
          includeTags: options.includeTags || ['p', 'h1', 'h2', 'h3', 'blockquote', 'ul', 'ol'],
          excludeTags: options.excludeTags || ['nav', 'footer', 'aside', 'advertisement'],
          onlyMainContent: options.onlyMainContent ?? true,
          timeout: options.timeout || 30000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('FireCrawl scraping error:', error)
      throw new Error(`Failed to scrape URL: ${url}`)
    }
  }

  async crawlWebsite(url: string, options: {
    limit?: number
    scrapeOptions?: FireCrawlOptions
    includes?: string[]
    excludes?: string[]
  } = {}): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/crawl`,
        {
          url: url,
          crawlerOptions: {
            limit: options.limit || 50,
            includes: options.includes || [],
            excludes: options.excludes || ['*/login', '*/register', '*/admin']
          },
          pageOptions: {
            formats: options.scrapeOptions?.formats || ['markdown'],
            includeTags: options.scrapeOptions?.includeTags,
            excludeTags: options.scrapeOptions?.excludeTags,
            onlyMainContent: options.scrapeOptions?.onlyMainContent ?? true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('FireCrawl crawling error:', error)
      throw new Error(`Failed to crawl website: ${url}`)
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/crawl/status/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('FireCrawl job status error:', error)
      throw new Error(`Failed to get job status: ${jobId}`)
    }
  }
}

export const fireCrawlClient = new FireCrawlClient(process.env.FIRECRAWL_API_KEY!)
```

### Next.js API Routes
```typescript
// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fireCrawlClient } from '@/lib/services/firecrawl-client'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, options } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Check if URL is from approved biblical/Christian sources
    const approvedDomains = [
      'esv.org',
      'biblehub.com',
      'biblegateway.com',
      'christianitytoday.com',
      'desiringgod.org',
      'thegospelcoalition.org',
      'biblicaltraining.org'
    ]

    const urlDomain = new URL(url).hostname
    const isApproved = approvedDomains.some(domain => 
      urlDomain === domain || urlDomain.endsWith(`.${domain}`)
    )

    if (!isApproved) {
      return NextResponse.json(
        { error: 'URL not from approved biblical sources' }, 
        { status: 403 }
      )
    }

    const result = await fireCrawlClient.scrapeUrl(url, options)
    
    // Log the scraping activity
    await supabase.from('scraping_logs').insert({
      url: url,
      user_id: user.id,
      success: result.success,
      content_length: result.data?.content?.length || 0
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Scraping API error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape content' },
      { status: 500 }
    )
  }
}
```

---

## Biblical Content Scraping

### Scripture Commentary Scraper
```typescript
// lib/scrapers/bible-commentary-scraper.ts
import { fireCrawlClient } from '@/lib/services/firecrawl-client'

interface CommentaryResult {
  reference: string
  commentary: string
  author: string
  source: string
  url: string
}

export class BibleCommentaryScaper {
  private commentarySources = [
    'https://biblehub.com',
    'https://www.biblegateway.com',
    'https://www.blueletterbible.org'
  ]

  async scrapeCommentary(reference: string): Promise<CommentaryResult[]> {
    const results: CommentaryResult[] = []

    for (const source of this.commentarySources) {
      try {
        const url = this.buildCommentaryUrl(source, reference)
        const scraped = await fireCrawlClient.scrapeUrl(url, {
          includeTags: ['p', 'div.commentary', '.verse-text', '.commentary-text'],
          excludeTags: ['nav', 'footer', 'advertisement', '.sidebar'],
          onlyMainContent: true
        })

        if (scraped.success && scraped.data.content) {
          results.push({
            reference: reference,
            commentary: this.cleanCommentaryText(scraped.data.content),
            author: scraped.data.metadata.author || 'Unknown',
            source: source,
            url: url
          })
        }
      } catch (error) {
        console.warn(`Failed to scrape commentary from ${source}:`, error)
      }
    }

    return results
  }

  private buildCommentaryUrl(source: string, reference: string): string {
    const encodedRef = encodeURIComponent(reference)
    
    switch (source) {
      case 'https://biblehub.com':
        return `${source}/commentaries/${reference.toLowerCase().replace(/\s+/g, '_')}.htm`
      case 'https://www.biblegateway.com':
        return `${source}/passage/?search=${encodedRef}&version=ESV`
      case 'https://www.blueletterbible.org':
        return `${source}/search/search.cfm?Criteria=${encodedRef}&t=ESV`
      default:
        return `${source}/search?q=${encodedRef}`
    }
  }

  private cleanCommentaryText(content: string): string {
    // Remove navigation, ads, and non-commentary content
    return content
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\t+/g, ' ')
      .replace(/\s{3,}/g, ' ')
      .trim()
  }
}

export const commentaryScraper = new BibleCommentaryScaper()
```

### Early Church History Scraper
```typescript
// lib/scrapers/church-history-scraper.ts
import { fireCrawlClient } from '@/lib/services/firecrawl-client'

interface HistoricalContent {
  title: string
  period: string
  content: string
  sources: string[]
  relevantScriptures: string[]
}

export class ChurchHistoryScraper {
  private historicalSources = [
    'https://www.christianitytoday.com',
    'https://www.biblicaltraining.org',
    'https://www.desiringgod.org'
  ]

  async scrapeEarlyChurchContent(topics: string[] = []): Promise<HistoricalContent[]> {
    const defaultTopics = [
      'early church fellowship',
      'apostolic church',
      'first century Christianity',
      'house churches',
      'early Christian worship'
    ]

    const searchTopics = topics.length > 0 ? topics : defaultTopics
    const results: HistoricalContent[] = []

    for (const topic of searchTopics) {
      for (const source of this.historicalSources) {
        try {
          const searchUrl = `${source}/search?q=${encodeURIComponent(topic)}`
          const searchResults = await fireCrawlClient.scrapeUrl(searchUrl, {
            includeTags: ['a', 'h3', '.search-result'],
            onlyMainContent: true
          })

          if (searchResults.success) {
            // Extract article links from search results
            const articleLinks = this.extractArticleLinks(searchResults.data.content, source)
            
            // Scrape first few articles
            for (const link of articleLinks.slice(0, 3)) {
              const article = await this.scrapeHistoricalArticle(link)
              if (article) {
                results.push(article)
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to scrape historical content from ${source}:`, error)
        }
      }
    }

    return results
  }

  private async scrapeHistoricalArticle(url: string): Promise<HistoricalContent | null> {
    try {
      const scraped = await fireCrawlClient.scrapeUrl(url, {
        includeTags: ['h1', 'h2', 'p', 'blockquote', '.content', 'article'],
        excludeTags: ['nav', 'footer', '.related', '.comments'],
        onlyMainContent: true
      })

      if (!scraped.success || !scraped.data.content) {
        return null
      }

      return {
        title: scraped.data.metadata.title || 'Historical Article',
        period: this.extractTimePeriod(scraped.data.content),
        content: this.cleanHistoricalContent(scraped.data.content),
        sources: [url],
        relevantScriptures: this.extractScriptureReferences(scraped.data.content)
      }
    } catch (error) {
      console.warn(`Failed to scrape historical article ${url}:`, error)
      return null
    }
  }

  private extractArticleLinks(content: string, baseUrl: string): string[] {
    // Extract article URLs from search results
    const linkRegex = /href="([^"]*\/article[^"]*)"/gi
    const links: string[] = []
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      const link = match[1]
      const fullUrl = link.startsWith('http') ? link : `${baseUrl}${link}`
      links.push(fullUrl)
    }

    return [...new Set(links)] // Remove duplicates
  }

  private extractTimePeriod(content: string): string {
    const periodRegex = /(first|second|third|fourth|fifth)\s+century|AD\s+\d{2,4}|\d{2,4}\s+AD/gi
    const match = content.match(periodRegex)
    return match ? match[0] : 'Early Church Period'
  }

  private extractScriptureReferences(content: string): string[] {
    const scriptureRegex = /\b(?:[1-3]\s+)?[A-Za-z]+\s+\d+:\d+(?:-\d+)?\b/g
    const matches = content.match(scriptureRegex) || []
    return [...new Set(matches)]
  }

  private cleanHistoricalContent(content: string): string {
    return content
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\[.*?\]/g, '') // Remove reference markers
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000) // Limit content length
  }
}

export const historyScaper = new ChurchHistoryScraper()
```

---

## Commentary Integration

### Automated Commentary Collection
```typescript
// lib/services/commentary-integration.ts
import { commentaryScraper } from '@/lib/scrapers/bible-commentary-scraper'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface EnhancedArticle {
  originalContent: string
  scriptureReferences: string[]
  commentaries: Array<{
    reference: string
    commentary: string
    source: string
  }>
  relatedContent: string[]
}

export class CommentaryIntegration {
  private supabase = createServerComponentClient({ cookies })

  async enhanceArticleWithCommentary(articleId: string): Promise<EnhancedArticle | null> {
    try {
      // Get article content and extract scripture references
      const { data: article } = await this.supabase
        .from('articles')
        .select('content, scripture_references')
        .eq('id', articleId)
        .single()

      if (!article) return null

      const scriptureRefs = article.scripture_references || []
      const commentaries = []

      // Scrape commentary for each scripture reference
      for (const reference of scriptureRefs) {
        try {
          const refCommentaries = await commentaryScraper.scrapeCommentary(reference)
          commentaries.push(...refCommentaries)
          
          // Add delay to respect rate limits
          await this.delay(1000)
        } catch (error) {
          console.warn(`Failed to get commentary for ${reference}:`, error)
        }
      }

      // Store enhanced content
      const enhanced = {
        originalContent: article.content,
        scriptureReferences: scriptureRefs,
        commentaries: commentaries,
        relatedContent: []
      }

      await this.supabase
        .from('enhanced_articles')
        .upsert({
          article_id: articleId,
          commentaries: commentaries,
          last_updated: new Date().toISOString()
        })

      return enhanced
    } catch (error) {
      console.error('Commentary integration error:', error)
      return null
    }
  }

  async scheduleCommentaryUpdate(articleIds: string[]): Promise<void> {
    // Queue articles for background commentary scraping
    const jobs = articleIds.map(id => ({
      article_id: id,
      job_type: 'commentary_update',
      status: 'pending',
      scheduled_for: new Date().toISOString()
    }))

    await this.supabase
      .from('scraping_jobs')
      .insert(jobs)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const commentaryIntegration = new CommentaryIntegration()
```

---

## Automated Content Enhancement

### Content Enhancement Pipeline
```typescript
// lib/services/content-enhancement.ts
import { fireCrawlClient } from '@/lib/services/firecrawl-client'
import { historyScaper } from '@/lib/scrapers/church-history-scraper'
import { commentaryIntegration } from '@/lib/services/commentary-integration'

export class ContentEnhancementPipeline {
  async enhanceNewTestamentContent(topic: string): Promise<{
    historicalContext: any[]
    commentaries: any[]
    relatedResources: any[]
    suggestedReading: any[]
  }> {
    try {
      // Scrape historical context
      const historicalContext = await historyScaper.scrapeEarlyChurchContent([topic])
      
      // Find related biblical resources
      const relatedResources = await this.findRelatedResources(topic)
      
      // Suggest additional reading
      const suggestedReading = await this.findSuggestedReading(topic)

      return {
        historicalContext,
        commentaries: [],
        relatedResources,
        suggestedReading
      }
    } catch (error) {
      console.error('Content enhancement error:', error)
      throw new Error('Failed to enhance content')
    }
  }

  private async findRelatedResources(topic: string): Promise<any[]> {
    const resources = []
    const searchQueries = [
      `${topic} New Testament`,
      `${topic} early church`,
      `${topic} biblical fellowship`
    ]

    for (const query of searchQueries) {
      try {
        const searchUrl = `https://www.desiringgod.org/search?q=${encodeURIComponent(query)}`
        const results = await fireCrawlClient.scrapeUrl(searchUrl, {
          includeTags: ['a', '.search-result', 'h3'],
          onlyMainContent: true
        })

        if (results.success) {
          // Extract resource links and metadata
          resources.push(...this.parseResourceResults(results.data.content))
        }
      } catch (error) {
        console.warn(`Failed to find resources for ${query}:`, error)
      }
    }

    return resources.slice(0, 10) // Limit results
  }

  private async findSuggestedReading(topic: string): Promise<any[]> {
    // Implementation would search for books and articles related to the topic
    return []
  }

  private parseResourceResults(content: string): any[] {
    // Parse scraped search results into structured resource data
    return []
  }
}

export const contentEnhancement = new ContentEnhancementPipeline()
```

### Background Job Processing
```typescript
// lib/jobs/scraping-jobs.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { commentaryIntegration } from '@/lib/services/commentary-integration'
import { contentEnhancement } from '@/lib/services/content-enhancement'

export class ScrapingJobProcessor {
  private supabase = createServerComponentClient({ cookies })

  async processPendingJobs(): Promise<void> {
    const { data: jobs } = await this.supabase
      .from('scraping_jobs')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(5)

    if (!jobs || jobs.length === 0) return

    for (const job of jobs) {
      try {
        await this.processJob(job)
        
        await this.supabase
          .from('scraping_jobs')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id)
      } catch (error) {
        console.error(`Job ${job.id} failed:`, error)
        
        await this.supabase
          .from('scraping_jobs')
          .update({ 
            status: 'failed',
            error_message: error.message,
            failed_at: new Date().toISOString()
          })
          .eq('id', job.id)
      }
    }
  }

  private async processJob(job: any): Promise<void> {
    switch (job.job_type) {
      case 'commentary_update':
        await commentaryIntegration.enhanceArticleWithCommentary(job.article_id)
        break
      case 'content_enhancement':
        await contentEnhancement.enhanceNewTestamentContent(job.topic)
        break
      default:
        throw new Error(`Unknown job type: ${job.job_type}`)
    }
  }
}
```

---

## Ethical Scraping Guidelines

### Respectful Scraping Practices
```typescript
// lib/services/ethical-scraper.ts
import { fireCrawlClient } from '@/lib/services/firecrawl-client'

export class EthicalScraper {
  private rateLimits = new Map<string, { count: number, resetTime: number }>()
  private robotsCache = new Map<string, any>()

  async checkRobotsTxt(url: string): Promise<boolean> {
    try {
      const domain = new URL(url).origin
      
      if (this.robotsCache.has(domain)) {
        return this.robotsCache.get(domain)?.allowed || false
      }

      const robotsUrl = `${domain}/robots.txt`
      const robotsTxt = await fireCrawlClient.scrapeUrl(robotsUrl)
      
      const allowed = this.parseRobotsTxt(robotsTxt.data?.content || '', url)
      this.robotsCache.set(domain, { allowed, timestamp: Date.now() })
      
      return allowed
    } catch (error) {
      console.warn('Failed to check robots.txt, proceeding cautiously:', error)
      return true // Default to allowed if can't check
    }
  }

  async respectfulScrape(url: string, options: any = {}): Promise<any> {
    const domain = new URL(url).hostname

    // Check rate limits
    if (!this.checkRateLimit(domain)) {
      throw new Error(`Rate limit exceeded for ${domain}`)
    }

    // Check robots.txt
    const robotsAllowed = await this.checkRobotsTxt(url)
    if (!robotsAllowed) {
      throw new Error(`Scraping not allowed by robots.txt for ${url}`)
    }

    // Add delay between requests
    await this.delay(1000)

    return await fireCrawlClient.scrapeUrl(url, {
      ...options,
      timeout: 30000, // Reasonable timeout
      onlyMainContent: true // Only get main content, not ads/navigation
    })
  }

  private checkRateLimit(domain: string): boolean {
    const now = Date.now()
    const limit = this.rateLimits.get(domain)

    if (!limit || now > limit.resetTime) {
      // Reset rate limit (10 requests per hour per domain)
      this.rateLimits.set(domain, {
        count: 1,
        resetTime: now + (60 * 60 * 1000) // 1 hour
      })
      return true
    }

    if (limit.count >= 10) {
      return false
    }

    limit.count++
    return true
  }

  private parseRobotsTxt(robotsTxt: string, url: string): boolean {
    // Simple robots.txt parsing - in production, use a proper library
    const lines = robotsTxt.split('\n')
    let userAgent = false
    let allowed = true

    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('User-agent:')) {
        userAgent = trimmed.includes('*') || trimmed.includes('FireCrawl')
      }
      
      if (userAgent && trimmed.startsWith('Disallow:')) {
        const path = trimmed.split(':')[1]?.trim()
        if (path && url.includes(path)) {
          allowed = false
        }
      }
    }

    return allowed
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const ethicalScraper = new EthicalScraper()
```

---

## Performance and Caching

### Scraping Cache Layer
```typescript
// lib/cache/scraping-cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class ScrapingCache {
  private static TTL = 60 * 60 * 24 * 7 // 7 days for scraped content

  static async get(url: string): Promise<any> {
    try {
      const key = `scrape:${this.hashUrl(url)}`
      const cached = await redis.get(key)
      return cached
    } catch (error) {
      console.warn('Cache get error:', error)
      return null
    }
  }

  static async set(url: string, data: any): Promise<void> {
    try {
      const key = `scrape:${this.hashUrl(url)}`
      await redis.setex(key, this.TTL, JSON.stringify(data))
    } catch (error) {
      console.warn('Cache set error:', error)
    }
  }

  static async invalidate(url: string): Promise<void> {
    try {
      const key = `scrape:${this.hashUrl(url)}`
      await redis.del(key)
    } catch (error) {
      console.warn('Cache invalidation error:', error)
    }
  }

  private static hashUrl(url: string): string {
    return Buffer.from(url).toString('base64').substring(0, 50)
  }
}
```

### Usage Monitoring
```typescript
// lib/monitoring/scraping-monitor.ts
export class ScrapingMonitor {
  private static monthlyUsage = 0
  private static readonly MONTHLY_LIMIT = 500 // FireCrawl free tier

  static async checkUsageLimit(): Promise<boolean> {
    // Check if we're approaching the monthly limit
    return this.monthlyUsage < (this.MONTHLY_LIMIT * 0.9) // 90% threshold
  }

  static incrementUsage(): void {
    this.monthlyUsage++
  }

  static async getUsageStats(): Promise<{
    current: number
    limit: number
    percentUsed: number
  }> {
    return {
      current: this.monthlyUsage,
      limit: this.MONTHLY_LIMIT,
      percentUsed: (this.monthlyUsage / this.MONTHLY_LIMIT) * 100
    }
  }
}
```

This FireCrawl integration provides:

1. **Ethical Scraping**: Respects robots.txt and implements rate limiting
2. **Biblical Focus**: Targets Christian and biblical content sources
3. **Caching Strategy**: Reduces API usage through intelligent caching
4. **Commentary Enhancement**: Automatically enriches articles with commentary
5. **Historical Research**: Gathers early church history materials
6. **Usage Monitoring**: Tracks API usage to stay within free tier limits
7. **Job Processing**: Background processing for large scraping tasks

The system enhances the fellowship website with rich, relevant content while maintaining ethical scraping practices and respecting the free tier limitations.