# Bible API Integration Guide
## The Church - New Testament Fellowship Website

### Table of Contents
1. [Bible APIs Overview](#bible-apis-overview)
2. [ESV API Integration](#esv-api-integration)
3. [Bible-API.com Integration](#bible-apicom-integration)
4. [Bible Brain API](#bible-brain-api)
5. [YouVersion API](#youversion-api)
6. [Bible Gateway Integration](#bible-gateway-integration)
7. [API Rate Limiting & Caching](#api-rate-limiting--caching)
8. [Bible Search Component](#bible-search-component)

---

## Bible APIs Overview

### Free Tier Bible APIs
We'll integrate multiple Bible APIs to provide comprehensive scripture access:

| API | Free Tier | Features | Use Case |
|-----|-----------|----------|----------|
| ESV API | 5,000 requests/day | High-quality text, copyright compliant | Primary scripture display |
| Bible-API.com | Unlimited | Simple JSON responses | Backup and cross-references |
| Bible Brain API | Generous free tier | Audio versions, multiple languages | Audio Bible features |
| YouVersion API | Limited free tier | Reading plans, popular verses | Devotional content |
| Bible Gateway | 500 requests/day | Commentaries, multiple translations | Study tools |

---

## ESV API Integration

### Setup and Configuration
```typescript
// lib/apis/esv-api.ts
import axios from 'axios'

const ESV_API_KEY = process.env.ESV_API_KEY
const ESV_BASE_URL = 'https://api.esv.org/v3'

interface ESVPassageResponse {
  query: string
  canonical: string
  parsed: number[][]
  passage_meta: Array<{
    canonical: string
    chapter_start: number[]
    chapter_end: number[]
    prev_verse: number
    next_verse: number
    prev_chapter: number[]
    next_chapter: number[]
  }>
  passages: string[]
}

class ESVApi {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getPassage(reference: string): Promise<ESVPassageResponse> {
    try {
      const response = await axios.get(`${ESV_BASE_URL}/passage/text/`, {
        headers: {
          'Authorization': `Token ${this.apiKey}`
        },
        params: {
          q: reference,
          'include-headings': false,
          'include-footnotes': false,
          'include-verse-numbers': true,
          'include-short-copyright': true,
          'include-passage-references': false
        }
      })
      
      return response.data
    } catch (error) {
      console.error('ESV API Error:', error)
      throw new Error(`Failed to fetch passage: ${reference}`)
    }
  }

  async searchPassages(query: string, limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(`${ESV_BASE_URL}/passage/search/`, {
        headers: {
          'Authorization': `Token ${this.apiKey}`
        },
        params: {
          q: query,
          'page-size': limit
        }
      })
      
      return response.data
    } catch (error) {
      console.error('ESV Search Error:', error)
      throw new Error(`Failed to search: ${query}`)
    }
  }
}

export const esvApi = new ESVApi(ESV_API_KEY!)
```

### Next.js API Route for ESV
```typescript
// app/api/bible/esv/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { esvApi } from '@/lib/apis/esv-api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')
  const search = searchParams.get('search')

  try {
    if (reference) {
      const passage = await esvApi.getPassage(reference)
      return NextResponse.json(passage)
    } else if (search) {
      const results = await esvApi.searchPassages(search)
      return NextResponse.json(results)
    } else {
      return NextResponse.json(
        { error: 'Missing reference or search parameter' },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Bible passage' },
      { status: 500 }
    )
  }
}
```

---

## Bible-API.com Integration

### Simple Bible API Client
```typescript
// lib/apis/bible-api.ts
import axios from 'axios'

interface BibleApiResponse {
  reference: string
  verses: Array<{
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>
  text: string
  translation_id: string
  translation_name: string
  translation_note: string
}

class BibleApi {
  private baseUrl = 'https://bible-api.com'

  async getPassage(reference: string, translation: string = 'kjv'): Promise<BibleApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${reference}?translation=${translation}`)
      return response.data
    } catch (error) {
      console.error('Bible-API Error:', error)
      throw new Error(`Failed to fetch passage: ${reference}`)
    }
  }

  async getMultipleTranslations(reference: string, translations: string[] = ['kjv', 'nasb', 'niv']) {
    const promises = translations.map(translation => 
      this.getPassage(reference, translation).catch(error => {
        console.warn(`Failed to fetch ${translation} for ${reference}:`, error)
        return null
      })
    )
    
    const results = await Promise.all(promises)
    return results.filter(Boolean)
  }
}

export const bibleApi = new BibleApi()
```

---

## Bible Brain API

### Audio Bible Integration
```typescript
// lib/apis/bible-brain-api.ts
import axios from 'axios'

interface BibleBrainResponse {
  data: Array<{
    id: string
    type: string
    attributes: {
      name: string
      description: string
      language: {
        name: string
        iso: string
      }
      audio_files?: Array<{
        book: string
        chapter: number
        url: string
        duration: number
      }>
    }
  }>
}

class BibleBrainApi {
  private baseUrl = 'https://4.dbt.io/api'
  private apiKey = process.env.BIBLE_BRAIN_API_KEY

  async getAudioBibles(language: string = 'en'): Promise<BibleBrainResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/bibles`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          language_code: language,
          media: 'audio'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Bible Brain API Error:', error)
      throw new Error('Failed to fetch audio Bibles')
    }
  }

  async getAudioChapter(bibleId: string, bookId: string, chapter: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/bibles/${bibleId}/books/${bookId}/chapters/${chapter}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )
      
      return response.data
    } catch (error) {
      console.error('Bible Brain Chapter Error:', error)
      throw new Error(`Failed to fetch audio for ${bookId} ${chapter}`)
    }
  }
}

export const bibleBrainApi = new BibleBrainApi()
```

---

## YouVersion API

### Reading Plans Integration
```typescript
// lib/apis/youversion-api.ts
import axios from 'axios'

interface YouVersionPlan {
  id: number
  title: string
  description: string
  duration_days: number
  image_url: string
  language: string
  plans_count: number
}

class YouVersionApi {
  private baseUrl = 'https://developers.youversion.com/1.0'
  private apiKey = process.env.YOUVERSION_API_KEY

  async getReadingPlans(language: string = 'en'): Promise<YouVersionPlan[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/reading_plans`, {
        headers: {
          'X-YouVersion-Developer-Token': this.apiKey,
          'Accept': 'application/json'
        },
        params: {
          language: language
        }
      })
      
      return response.data.response.data
    } catch (error) {
      console.error('YouVersion API Error:', error)
      throw new Error('Failed to fetch reading plans')
    }
  }

  async getVerseOfTheDay(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/verse_of_the_day`, {
        headers: {
          'X-YouVersion-Developer-Token': this.apiKey,
          'Accept': 'application/json'
        }
      })
      
      return response.data.response.data
    } catch (error) {
      console.error('YouVersion VOTD Error:', error)
      throw new Error('Failed to fetch verse of the day')
    }
  }
}

export const youVersionApi = new YouVersionApi()
```

---

## Bible Gateway Integration

### Commentary and Study Tools
```typescript
// lib/apis/bible-gateway-api.ts
import axios from 'axios'

interface BibleGatewayResponse {
  reference: string
  text: string
  version: string
  commentary?: string
  cross_references?: string[]
}

class BibleGatewayApi {
  private baseUrl = 'https://api.biblegateway.com/3'
  private apiKey = process.env.BIBLE_GATEWAY_API_KEY

  async getPassageWithCommentary(reference: string, version: string = 'NIV'): Promise<BibleGatewayResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/passage`, {
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Accept': 'application/json'
        },
        params: {
          search: reference,
          version: version,
          'include-commentary': true,
          'include-cross-references': true
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Bible Gateway API Error:', error)
      throw new Error(`Failed to fetch passage with commentary: ${reference}`)
    }
  }

  async searchWithContext(query: string, version: string = 'NIV') {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Accept': 'application/json'
        },
        params: {
          q: query,
          version: version,
          'result-count': 20
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Bible Gateway Search Error:', error)
      throw new Error(`Failed to search: ${query}`)
    }
  }
}

export const bibleGatewayApi = new BibleGatewayApi()
```

---

## API Rate Limiting & Caching

### Redis Caching Strategy
```typescript
// lib/cache/bible-cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class BibleCache {
  private static TTL = 60 * 60 * 24 // 24 hours

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      return cached as T
    } catch (error) {
      console.warn('Cache get error:', error)
      return null
    }
  }

  static async set(key: string, value: any, ttl: number = this.TTL): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.warn('Cache set error:', error)
    }
  }

  static generateKey(api: string, method: string, params: Record<string, any>): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')
    
    return `bible:${api}:${method}:${paramString}`
  }
}
```

### Rate Limiting Middleware
```typescript
// lib/middleware/rate-limit.ts
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  esv: { daily: 5000, current: 0, reset: Date }
  bibleGateway: { daily: 500, current: 0, reset: Date }
}

class RateLimitManager {
  private limits: Map<string, RateLimitConfig> = new Map()

  async checkLimit(api: 'esv' | 'bibleGateway', ip: string): Promise<boolean> {
    const key = `${api}:${ip}`
    const now = new Date()
    
    let config = this.limits.get(key)
    if (!config || now > config[api].reset) {
      // Reset daily limits
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      config = {
        esv: { daily: 5000, current: 0, reset: tomorrow },
        bibleGateway: { daily: 500, current: 0, reset: tomorrow }
      }
      this.limits.set(key, config)
    }

    const apiConfig = config[api]
    if (apiConfig.current >= apiConfig.daily) {
      return false
    }

    apiConfig.current++
    return true
  }
}

export const rateLimitManager = new RateLimitManager()
```

---

## Bible Search Component

### React Component with Multiple APIs
```tsx
// components/bible/BibleSearch.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, BookOpen, Volume2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BiblePassage {
  reference: string
  text: string
  translation: string
  audio_url?: string
  commentary?: string
}

export function BibleSearch() {
  const [query, setQuery] = useState('')
  const [passages, setPassages] = useState<BiblePassage[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState('ESV')

  const searchBible = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/bible/search?q=${encodeURIComponent(query)}&translation=${selectedTranslation}`)
      const data = await response.json()
      setPassages(data.passages || [])
    } catch (error) {
      console.error('Bible search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search for Bible verses... (e.g., 'John 3:16' or 'love')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchBible()}
          />
        </div>
        <select
          value={selectedTranslation}
          onChange={(e) => setSelectedTranslation(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="ESV">ESV</option>
          <option value="NIV">NIV</option>
          <option value="KJV">KJV</option>
          <option value="NASB">NASB</option>
        </select>
        <Button onClick={searchBible} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching scriptures...</p>
        </div>
      )}

      <div className="space-y-6">
        {passages.map((passage, index) => (
          <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {passage.reference} ({passage.translation})
              </h3>
              <div className="flex gap-2">
                {passage.audio_url && (
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="prose prose-lg text-gray-700 mb-4">
              {passage.text}
            </div>

            {passage.commentary && (
              <details className="mt-4">
                <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                  Commentary & Study Notes
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-600">
                  {passage.commentary}
                </div>
              </details>
            )}

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Discuss
              </Button>
              <Button variant="outline" size="sm">
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### API Route for Unified Bible Search
```typescript
// app/api/bible/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { esvApi } from '@/lib/apis/esv-api'
import { bibleApi } from '@/lib/apis/bible-api'
import { BibleCache } from '@/lib/cache/bible-cache'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const translation = searchParams.get('translation') || 'ESV'

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter required' },
      { status: 400 }
    )
  }

  try {
    // Check cache first
    const cacheKey = BibleCache.generateKey('search', 'unified', { query, translation })
    const cached = await BibleCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    let passages = []

    // Try ESV API first for primary translation
    if (translation === 'ESV') {
      try {
        const esvResult = await esvApi.getPassage(query)
        passages = esvResult.passages.map((text, index) => ({
          reference: esvResult.passage_meta[index]?.canonical || query,
          text: text,
          translation: 'ESV'
        }))
      } catch (error) {
        console.warn('ESV API failed, falling back to Bible-API')
      }
    }

    // Fallback to Bible-API.com
    if (passages.length === 0) {
      try {
        const bibleResult = await bibleApi.getPassage(query, translation.toLowerCase())
        passages = [{
          reference: bibleResult.reference,
          text: bibleResult.text,
          translation: bibleResult.translation_name
        }]
      } catch (error) {
        console.error('All Bible APIs failed:', error)
      }
    }

    const result = { passages }
    
    // Cache the result
    await BibleCache.set(cacheKey, result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Bible search error:', error)
    return NextResponse.json(
      { error: 'Failed to search Bible' },
      { status: 500 }
    )
  }
}
```

This comprehensive Bible API integration provides:

1. **Multiple API Support**: ESV, Bible-API, Bible Brain, YouVersion, and Bible Gateway
2. **Caching Strategy**: Redis caching to minimize API calls
3. **Rate Limiting**: Respect API limits and manage usage
4. **Fallback System**: Graceful degradation when primary APIs fail
5. **Rich Features**: Text, audio, commentary, and cross-references
6. **Search Interface**: User-friendly Bible search component

The system prioritizes free tiers and provides comprehensive scripture access for the fellowship website.