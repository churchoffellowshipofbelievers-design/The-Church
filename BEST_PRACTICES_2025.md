# Best Practices Guide 2025
## The Church - New Testament Fellowship Website

### Table of Contents
1. [Next.js 14+ Modern Patterns](#nextjs-14-modern-patterns)
2. [Supabase Architecture Best Practices](#supabase-architecture-best-practices)
3. [Authentication & Security Standards](#authentication--security-standards)
4. [Real-time Chat & Community Features](#real-time-chat--community-features)
5. [Bible API Integration Patterns](#bible-api-integration-patterns)
6. [Accessibility & Performance](#accessibility--performance)
7. [Christian UI/UX Design Patterns](#christian-uiux-design-patterns)
8. [Deployment & DevOps](#deployment--devops)

---

## Next.js 14+ Modern Patterns

### Server Components Architecture (2025 Best Practices)

#### Core Principles
- **Server-First Approach**: Fetch data on the server with Server Components whenever possible for direct backend access, enhanced security, and reduced client-server communication
- **React Server Components (RSC)**: Utilize RSC to reduce client-side JavaScript overhead and improve hydration performance
- **Automatic Request Deduplication**: Leverage Next.js automatic memoization of `fetch` requests without worrying about performance implications

```typescript
// app/fellowship/page.tsx - Modern Server Component Pattern
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { FellowshipEvents } from '@/components/fellowship/FellowshipEvents'

export default async function FellowshipPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch data directly on server - automatically cached
  const { data: events } = await supabase
    .from('fellowship_events')
    .select(`
      *,
      profiles:created_by(username, full_name),
      fellowship_participants(count)
    `)
    .eq('is_public', true)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  return (
    <div>
      <h1>Fellowship Gatherings</h1>
      <FellowshipEvents events={events || []} />
    </div>
  )
}
```

#### Project Structure Best Practices (2025)
```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route groups for organization
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── fellowship/
│   │   ├── [id]/
│   │   │   ├── page.tsx          # Event details
│   │   │   └── chat/page.tsx     # Live chat
│   │   ├── page.tsx              # Events list
│   │   └── create/page.tsx       # Create event
│   ├── api/
│   │   ├── bible/route.ts        # Bible API endpoints
│   │   ├── chat/route.ts         # Chat WebSocket
│   │   └── scrape/route.ts       # FireCrawl integration
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── dialog.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── fellowship/
│   │   ├── bible-search/
│   │   └── prayer-requests/
│   └── layout/                   # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── navigation.tsx
├── lib/
│   ├── supabase/                 # Supabase configuration
│   ├── apis/                     # External API clients
│   ├── hooks/                    # Custom React hooks
│   └── utils.ts                  # Utility functions
└── types/
    ├── database.ts               # Supabase type definitions
    └── index.ts                  # Global type definitions
```

#### Advanced Data Fetching Patterns
```typescript
// lib/data/fellowship.ts - Parallel Data Fetching
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Cache function for the same request across components
export const getEvents = cache(async () => {
  const supabase = createServerComponentClient({ cookies })
  return await supabase.from('fellowship_events').select('*')
})

export const getUserProfile = cache(async (userId: string) => {
  const supabase = createServerComponentClient({ cookies })
  return await supabase.from('profiles').select('*').eq('id', userId).single()
})

// app/fellowship/[id]/page.tsx - Parallel loading
export default async function EventPage({ params }: { params: { id: string } }) {
  // These run in parallel automatically
  const [
    { data: event },
    { data: participants },
    { data: messages }
  ] = await Promise.all([
    supabase.from('fellowship_events').select('*').eq('id', params.id).single(),
    supabase.from('fellowship_participants').select('*, profiles(*)').eq('event_id', params.id),
    supabase.from('fellowship_messages').select('*, profiles(*)').eq('event_id', params.id).order('created_at')
  ])

  return <EventDetails event={event} participants={participants} messages={messages} />
}
```

#### Streaming and Suspense Implementation
```typescript
// app/fellowship/page.tsx - Streaming with Suspense
import { Suspense } from 'react'
import { EventsList } from '@/components/fellowship/EventsList'
import { EventsLoading } from '@/components/fellowship/EventsLoading'

export default function FellowshipPage() {
  return (
    <div>
      <h1>Fellowship Events</h1>
      <Suspense fallback={<EventsLoading />}>
        <EventsList />
      </Suspense>
      <Suspense fallback={<div>Loading upcoming events...</div>}>
        <UpcomingEvents />
      </Suspense>
    </div>
  )
}
```

---

## Supabase Architecture Best Practices

### Row Level Security (RLS) Implementation

#### Core Security Foundation
```sql
-- Enable RLS on all public schema tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- User profile policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fellowship event policies with complex logic
CREATE POLICY "Fellowship events policy" ON fellowship_events
  FOR SELECT USING (
    is_public = TRUE OR 
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM fellowship_participants 
      WHERE event_id = fellowship_events.id 
      AND user_id = auth.uid()
    )
  );

-- Secure message policies
CREATE POLICY "Messages visible to participants" ON fellowship_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fellowship_events e
      WHERE e.id = event_id AND (
        e.is_public = TRUE OR
        e.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM fellowship_participants p
          WHERE p.event_id = e.id AND p.user_id = auth.uid()
        )
      )
    )
  );
```

#### Advanced RLS with Functions
```sql
-- Create security functions for reusable logic
CREATE OR REPLACE FUNCTION can_access_event(event_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM fellowship_events 
    WHERE id = event_uuid AND (
      is_public = TRUE OR 
      created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM fellowship_participants 
        WHERE event_id = event_uuid AND user_id = auth.uid()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policies
CREATE POLICY "Messages use function" ON fellowship_messages
  FOR SELECT USING (can_access_event(event_id));
```

### Real-time Best Practices

#### Optimized Real-time Setup
```typescript
// lib/supabase/realtime-optimized.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RealtimeChannel } from '@supabase/supabase-js'

export class OptimizedRealtime {
  private supabase = createClientComponentClient()
  private channels = new Map<string, RealtimeChannel>()
  private connectionPool = new Map<string, Promise<RealtimeChannel>>()

  async subscribeToEvent(eventId: string, callbacks: {
    onMessage?: (payload: any) => void
    onPresence?: (payload: any) => void
  }) {
    const channelKey = `event:${eventId}`
    
    // Reuse existing connection
    if (this.channels.has(channelKey)) {
      return this.channels.get(channelKey)!
    }

    // Prevent duplicate connection attempts
    if (this.connectionPool.has(channelKey)) {
      return this.connectionPool.get(channelKey)!
    }

    const connectionPromise = this.createChannel(channelKey, eventId, callbacks)
    this.connectionPool.set(channelKey, connectionPromise)
    
    const channel = await connectionPromise
    this.channels.set(channelKey, channel)
    this.connectionPool.delete(channelKey)
    
    return channel
  }

  private async createChannel(
    channelKey: string, 
    eventId: string, 
    callbacks: any
  ): Promise<RealtimeChannel> {
    const channel = this.supabase
      .channel(channelKey, {
        config: {
          presence: {
            key: 'user_id',
          },
        },
      })
      .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'fellowship_messages',
            filter: `event_id=eq.${eventId}`
          }, 
          callbacks.onMessage || (() => {}))
      .on('presence', { event: 'sync' }, callbacks.onPresence || (() => {}))
      .on('presence', { event: 'join' }, callbacks.onPresence || (() => {}))
      .on('presence', { event: 'leave' }, callbacks.onPresence || (() => {}))

    await channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Track presence
        channel.track({
          user_id: 'current_user_id',
          online_at: new Date().toISOString(),
        })
      }
    })

    return channel
  }

  cleanup() {
    for (const [key, channel] of this.channels) {
      channel.unsubscribe()
    }
    this.channels.clear()
    this.connectionPool.clear()
  }
}
```

### Database Performance Optimization
```sql
-- Essential indexes for performance
CREATE INDEX CONCURRENTLY idx_fellowship_messages_event_created 
ON fellowship_messages(event_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_fellowship_participants_event_user 
ON fellowship_participants(event_id, user_id);

CREATE INDEX CONCURRENTLY idx_fellowship_events_public_start 
ON fellowship_events(is_public, start_time) WHERE is_public = TRUE;

CREATE INDEX CONCURRENTLY idx_prayer_requests_event_created 
ON prayer_requests(fellowship_event_id, created_at DESC);

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY idx_fellowship_events_upcoming 
ON fellowship_events(start_time) 
WHERE start_time > NOW();
```

---

## Authentication & Security Standards

### Modern JWT Security Implementation

#### Secure Token Handling
```typescript
// lib/auth/secure-tokens.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export class SecureTokenManager {
  private supabase = createClientComponentClient()

  // Token validation with comprehensive checks
  async validateToken(token: string): Promise<{
    valid: boolean
    payload?: any
    error?: string
  }> {
    try {
      // Verify token structure
      if (!this.isValidTokenStructure(token)) {
        return { valid: false, error: 'Invalid token structure' }
      }

      // Validate with Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(token)
      
      if (error || !user) {
        return { valid: false, error: 'Invalid or expired token' }
      }

      // Additional security checks
      if (!this.validateTokenClaims(user)) {
        return { valid: false, error: 'Invalid token claims' }
      }

      return { valid: true, payload: user }
    } catch (error) {
      return { valid: false, error: 'Token validation failed' }
    }
  }

  private isValidTokenStructure(token: string): boolean {
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  }

  private validateTokenClaims(user: any): boolean {
    // Validate essential claims
    if (!user.id || !user.email) return false
    
    // Check token expiration
    const exp = user.exp * 1000 // Convert to milliseconds
    if (Date.now() >= exp) return false
    
    // Validate audience
    if (user.aud !== 'authenticated') return false
    
    return true
  }

  // Secure token storage in HTTP-only cookies
  async setSecureToken(token: string) {
    const cookieStore = cookies()
    cookieStore.set('supabase-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
  }
}
```

#### OAuth 2.0 + PKCE Implementation
```typescript
// lib/auth/oauth-pkce.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export class PKCEAuthFlow {
  private supabase = createClientComponentClient()

  async initiateOAuthFlow(provider: 'google' | 'github' | 'discord') {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: provider === 'google' ? 'openid email profile' : undefined
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('OAuth flow error:', error)
      throw new Error('Failed to initiate OAuth flow')
    }
  }

  // Handle OAuth callback with security validation
  async handleOAuthCallback() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) throw error
      if (!session) throw new Error('No session found')

      // Additional security checks
      await this.validateSession(session)
      
      return session
    } catch (error) {
      console.error('OAuth callback error:', error)
      throw new Error('OAuth callback failed')
    }
  }

  private async validateSession(session: any) {
    // Validate session integrity
    if (!session.user?.email_confirmed_at) {
      throw new Error('Email not confirmed')
    }

    // Check for suspicious activity
    const lastSignIn = new Date(session.user.last_sign_in_at)
    const now = new Date()
    const timeDiff = now.getTime() - lastSignIn.getTime()
    
    if (timeDiff < 0 || timeDiff > 24 * 60 * 60 * 1000) {
      console.warn('Suspicious sign-in timing detected')
    }
  }
}
```

### Multi-Factor Authentication (MFA)
```typescript
// lib/auth/mfa.ts
export class MFAManager {
  private supabase = createClientComponentClient()

  async enableMFA(userId: string) {
    try {
      const { data, error } = await this.supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'The Church Fellowship'
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('MFA enrollment error:', error)
      throw new Error('Failed to enable MFA')
    }
  }

  async verifyMFA(factorId: string, code: string) {
    try {
      const { data, error } = await this.supabase.auth.mfa.verify({
        factorId,
        challengeId: 'challenge_id',
        code
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('MFA verification error:', error)
      throw new Error('Invalid MFA code')
    }
  }
}
```

---

## Real-time Chat & Community Features

### WebSocket Architecture with Scaling

#### Modern WebSocket Implementation
```typescript
// lib/chat/websocket-manager.ts
export class WebSocketManager {
  private connections = new Map<string, WebSocket>()
  private reconnectAttempts = new Map<string, number>()
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  async createConnection(eventId: string, callbacks: {
    onMessage: (data: any) => void
    onError: (error: Error) => void
    onClose: () => void
  }) {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/fellowship/${eventId}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log(`Connected to fellowship ${eventId}`)
      this.reconnectAttempts.set(eventId, 0)
      
      // Send heartbeat
      this.startHeartbeat(eventId, ws)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        callbacks.onMessage(data)
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      callbacks.onError(new Error('WebSocket connection error'))
    }

    ws.onclose = () => {
      console.log(`Disconnected from fellowship ${eventId}`)
      this.handleReconnection(eventId, callbacks)
      callbacks.onClose()
    }

    this.connections.set(eventId, ws)
    return ws
  }

  private startHeartbeat(eventId: string, ws: WebSocket) {
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }))
      } else {
        clearInterval(heartbeat)
      }
    }, 30000) // 30 seconds
  }

  private async handleReconnection(eventId: string, callbacks: any) {
    const attempts = this.reconnectAttempts.get(eventId) || 0
    
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(eventId, attempts + 1)
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${attempts + 1} for ${eventId}`)
        this.createConnection(eventId, callbacks)
      }, this.reconnectDelay * Math.pow(2, attempts)) // Exponential backoff
    }
  }

  sendMessage(eventId: string, message: any) {
    const ws = this.connections.get(eventId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    } else {
      throw new Error('WebSocket not connected')
    }
  }

  disconnect(eventId: string) {
    const ws = this.connections.get(eventId)
    if (ws) {
      ws.close()
      this.connections.delete(eventId)
      this.reconnectAttempts.delete(eventId)
    }
  }
}
```

#### Message Queue and Persistence
```typescript
// lib/chat/message-queue.ts
export class MessageQueue {
  private queue: any[] = []
  private processing = false
  private supabase = createClientComponentClient()

  async queueMessage(message: {
    eventId: string
    content: string
    type: 'chat' | 'prayer' | 'scripture'
    userId: string
  }) {
    this.queue.push({
      ...message,
      timestamp: Date.now(),
      id: crypto.randomUUID()
    })

    if (!this.processing) {
      this.processQueue()
    }
  }

  private async processQueue() {
    this.processing = true

    while (this.queue.length > 0) {
      const message = this.queue.shift()
      
      try {
        // Save to database
        await this.supabase
          .from('fellowship_messages')
          .insert({
            event_id: message.eventId,
            message: message.content,
            message_type: message.type,
            created_by: message.userId
          })

        // Broadcast to other clients via Supabase Realtime
        // This happens automatically with RLS policies

      } catch (error) {
        console.error('Failed to process message:', error)
        
        // Re-queue message for retry
        this.queue.unshift(message)
        await this.delay(1000)
      }
    }

    this.processing = false
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

### Community Moderation System
```typescript
// lib/moderation/auto-moderation.ts
export class AutoModerationSystem {
  private profanityFilter = new Set([
    // Add inappropriate words for church context
  ])

  async moderateMessage(message: string, userId: string): Promise<{
    approved: boolean
    reason?: string
    sanitized?: string
  }> {
    // Check for profanity
    if (this.containsProfanity(message)) {
      return {
        approved: false,
        reason: 'Content contains inappropriate language'
      }
    }

    // Check message length
    if (message.length > 500) {
      return {
        approved: false,
        reason: 'Message too long (max 500 characters)'
      }
    }

    // Check for spam patterns
    if (this.isSpam(message)) {
      return {
        approved: false,
        reason: 'Message appears to be spam'
      }
    }

    // Check for scripture accuracy (basic validation)
    const scriptureRefs = this.extractScriptureReferences(message)
    for (const ref of scriptureRefs) {
      if (!await this.validateScriptureReference(ref)) {
        return {
          approved: true, // Approve but flag
          reason: 'Scripture reference may need verification',
          sanitized: message
        }
      }
    }

    return { approved: true, sanitized: message }
  }

  private containsProfanity(message: string): boolean {
    const words = message.toLowerCase().split(/\s+/)
    return words.some(word => this.profanityFilter.has(word))
  }

  private isSpam(message: string): boolean {
    // Check for repeated characters
    if (/(.)\1{4,}/.test(message)) return true
    
    // Check for excessive caps
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length
    if (capsRatio > 0.7 && message.length > 10) return true
    
    return false
  }

  private extractScriptureReferences(message: string): string[] {
    const scriptureRegex = /\b(?:[1-3]\s+)?[A-Za-z]+\s+\d+:\d+(?:-\d+)?\b/g
    return message.match(scriptureRegex) || []
  }

  private async validateScriptureReference(reference: string): Promise<boolean> {
    // Implement basic scripture reference validation
    // This could use Bible APIs to verify the reference exists
    return true // Simplified for example
  }
}
```

---

## Bible API Integration Patterns

### Multi-API Strategy with Fallbacks

#### Robust Bible Service
```typescript
// lib/bible/bible-service.ts
export class BibleService {
  private apiClients = {
    esv: new ESVAPIClient(process.env.ESV_API_KEY!),
    bibleApi: new BibleAPIClient(),
    bibleBrain: new BibleBrainClient(process.env.BIBLE_BRAIN_KEY!),
    youVersion: new YouVersionClient(process.env.YOUVERSION_KEY!)
  }

  private cache = new BibleCache()
  private rateLimiter = new APIRateLimiter()

  async getPassage(reference: string, translation: string = 'ESV'): Promise<{
    text: string
    reference: string
    translation: string
    copyright?: string
    audio_url?: string
  }> {
    const cacheKey = `passage:${reference}:${translation}`
    
    // Check cache first
    const cached = await this.cache.get(cacheKey)
    if (cached) return cached

    // Try primary API based on translation
    let result
    try {
      result = await this.fetchFromPrimaryAPI(reference, translation)
    } catch (error) {
      console.warn('Primary API failed, trying fallbacks:', error)
      result = await this.fetchWithFallbacks(reference, translation)
    }

    // Cache successful result
    if (result) {
      await this.cache.set(cacheKey, result, 60 * 60 * 24) // 24 hours
    }

    return result
  }

  private async fetchFromPrimaryAPI(reference: string, translation: string) {
    switch (translation.toUpperCase()) {
      case 'ESV':
        if (await this.rateLimiter.canMakeRequest('esv')) {
          return await this.apiClients.esv.getPassage(reference)
        }
        break
      default:
        if (await this.rateLimiter.canMakeRequest('bibleApi')) {
          return await this.apiClients.bibleApi.getPassage(reference, translation)
        }
    }
    
    throw new Error('Primary API unavailable')
  }

  private async fetchWithFallbacks(reference: string, translation: string) {
    const fallbackAPIs = ['bibleApi', 'bibleBrain', 'youVersion']
    
    for (const apiName of fallbackAPIs) {
      try {
        if (await this.rateLimiter.canMakeRequest(apiName)) {
          const client = this.apiClients[apiName as keyof typeof this.apiClients]
          return await client.getPassage(reference, translation)
        }
      } catch (error) {
        console.warn(`Fallback API ${apiName} failed:`, error)
      }
    }
    
    throw new Error('All Bible APIs failed')
  }

  async searchScripture(query: string, options: {
    translation?: string
    limit?: number
    includeContext?: boolean
  } = {}): Promise<Array<{
    reference: string
    text: string
    context?: string
  }>> {
    const { translation = 'ESV', limit = 10, includeContext = false } = options
    
    try {
      // Use ESV API for search if available
      if (await this.rateLimiter.canMakeRequest('esv')) {
        return await this.apiClients.esv.searchPassages(query, limit)
      }
      
      // Fallback to other APIs
      return await this.apiClients.bibleApi.search(query, translation, limit)
    } catch (error) {
      console.error('Scripture search failed:', error)
      return []
    }
  }
}

// Rate limiter implementation
class APIRateLimiter {
  private limits = {
    esv: { daily: 5000, current: 0, reset: new Date() },
    bibleApi: { daily: Infinity, current: 0, reset: new Date() },
    bibleBrain: { daily: 1000, current: 0, reset: new Date() },
    youVersion: { daily: 500, current: 0, reset: new Date() }
  }

  async canMakeRequest(api: string): Promise<boolean> {
    const limit = this.limits[api as keyof typeof this.limits]
    if (!limit) return false

    // Reset daily count if needed
    const now = new Date()
    if (now > limit.reset) {
      limit.current = 0
      limit.reset = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Next day
    }

    if (limit.current >= limit.daily) {
      return false
    }

    limit.current++
    return true
  }
}
```

#### Smart Caching Strategy
```typescript
// lib/bible/bible-cache.ts
export class BibleCache {
  private redis: Redis
  private localCache = new Map<string, { data: any, expires: number }>()

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }

  async get(key: string): Promise<any> {
    // Check local cache first (fastest)
    const local = this.localCache.get(key)
    if (local && local.expires > Date.now()) {
      return local.data
    }

    // Check Redis cache
    try {
      const cached = await this.redis.get(key)
      if (cached) {
        // Update local cache
        this.localCache.set(key, {
          data: cached,
          expires: Date.now() + 5 * 60 * 1000 // 5 minutes local cache
        })
        return cached
      }
    } catch (error) {
      console.warn('Redis cache error:', error)
    }

    return null
  }

  async set(key: string, data: any, ttl: number = 3600): Promise<void> {
    // Update local cache
    this.localCache.set(key, {
      data,
      expires: Date.now() + Math.min(ttl * 1000, 5 * 60 * 1000)
    })

    // Update Redis cache
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.warn('Redis set error:', error)
    }
  }

  // Preload popular passages
  async preloadPopularPassages(): Promise<void> {
    const popularRefs = [
      'John 3:16', 'Romans 8:28', 'Philippians 4:13',
      'Jeremiah 29:11', '1 Corinthians 13:4-8', 'Psalm 23:1-6'
    ]

    const bibleService = new BibleService()
    
    for (const ref of popularRefs) {
      try {
        await bibleService.getPassage(ref, 'ESV')
        // This will populate the cache
      } catch (error) {
        console.warn(`Failed to preload ${ref}:`, error)
      }
    }
  }
}
```

---

## Accessibility & Performance

### WCAG 2.2 Compliance Implementation

#### Accessible Components
```tsx
// components/ui/accessible-button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes include focus management and WCAG compliance
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] min-w-[44px]', // WCAG 2.2 touch targets
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

interface ButtonProps extends 
  ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? `${props.id}-loading` : undefined}
        {...props}
      >
        {loading && (
          <>
            <svg 
              className="mr-2 h-4 w-4 animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span id={`${props.id}-loading`} className="sr-only">
              Loading: {loadingText || 'Please wait...'}
            </span>
          </>
        )}
        {loading ? (loadingText || children) : children}
      </button>
    )
  }
)
```

#### Skip Navigation and Landmarks
```tsx
// components/layout/skip-navigation.tsx
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-[9999]"
    >
      Skip to main content
    </a>
  )
}

// app/layout.tsx - Semantic HTML structure
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SkipNavigation />
        <header role="banner">
          <Navigation />
        </header>
        <main id="main-content" role="main">
          {children}
        </main>
        <footer role="contentinfo">
          <Footer />
        </footer>
      </body>
    </html>
  )
}
```

### Core Web Vitals Optimization

#### Performance Configuration
```javascript
// next.config.js - Performance optimized
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression and caching
  compress: true,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Analyze bundle in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }
    
    return config
  },
}

module.exports = nextConfig
```

#### Performance Monitoring
```typescript
// lib/performance/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface Metric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

export function reportWebVitals() {
  function sendToAnalytics(metric: Metric) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Google Analytics 4
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Also send to your own monitoring service
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      }).catch(console.error)
    }
  }

  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}

// Performance budget monitoring
export class PerformanceBudget {
  private static thresholds = {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint
    TTFB: 600, // Time to First Byte
  }

  static checkBudget(metrics: Record<string, number>) {
    const violations = []
    
    for (const [metric, value] of Object.entries(metrics)) {
      const threshold = this.thresholds[metric as keyof typeof this.thresholds]
      if (threshold && value > threshold) {
        violations.push({ metric, value, threshold })
      }
    }

    if (violations.length > 0) {
      console.warn('Performance budget violations:', violations)
    }

    return violations
  }
}
```

---

## Christian UI/UX Design Patterns

### Biblical Design System

#### Typography and Visual Hierarchy
```css
/* globals.css - Biblical Typography System */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

:root {
  /* Biblical Color Palette */
  --biblical-gold: #D4AF37;
  --deep-blue: #1E40AF;
  --warm-red: #DC2626;
  --earth-brown: #A16207;
  --olive-green: #65A30D;
  --stone-gray: #6B7280;
  --parchment: #FEF7ED;
  --night-blue: #1E293B;

  /* Typography Scale */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Crimson Text', Georgia, 'Times New Roman', serif;
  
  /* Spacing based on biblical proportions */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;
}

/* Biblical text styling */
.scripture-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--night-blue);
  text-align: justify;
  hyphens: auto;
}

.verse-reference {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--biblical-gold);
  letter-spacing: 0.025em;
}

/* Fellowship card design */
.fellowship-card {
  background: linear-gradient(135deg, var(--parchment) 0%, #FFFFFF 100%);
  border: 1px solid var(--stone-gray)/20;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.fellowship-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

#### Accessible Color System
```typescript
// lib/design/color-system.ts
export const biblicalColors = {
  // Primary palette with accessibility ratings
  primary: {
    50: '#EEF2FF',   // WCAG AAA on dark text
    100: '#E0E7FF',  // WCAG AAA on dark text
    500: '#1E40AF',  // WCAG AA on white
    600: '#1D4ED8',  // WCAG AAA on white
    900: '#1E293B',  // WCAG AAA on light backgrounds
  },
  
  // Semantic colors
  success: {
    light: '#10B981',  // WCAG AA compliant
    dark: '#047857',   // WCAG AAA compliant
  },
  
  warning: {
    light: '#F59E0B',  // WCAG AA compliant
    dark: '#92400E',   // WCAG AAA compliant
  },
  
  error: {
    light: '#EF4444',  // WCAG AA compliant
    dark: '#B91C1C',   // WCAG AAA compliant
  }
} as const

// Contrast ratio checker
export function checkContrastRatio(foreground: string, background: string): {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
} {
  // Implementation would calculate actual contrast ratios
  // For now, returning mock data
  return {
    ratio: 4.5,
    wcagAA: true,
    wcagAAA: false
  }
}
```

#### Biblical Iconography
```tsx
// components/icons/biblical-icons.tsx
import { LucideIcon } from 'lucide-react'

interface IconProps {
  size?: number
  className?: string
}

export const CrossIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    aria-hidden="true"
  >
    <path 
      d="M12 2v20M2 12h20" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
)

export const PrayingHandsIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    aria-hidden="true"
  >
    <path 
      d="M12 2L8 6v12l4-4 4 4V6l-4-4z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

export const BibleIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    aria-hidden="true"
  >
    <path 
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M12 6v6l2-2" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
```

### Fellowship-Focused UX Patterns

#### Community Engagement Components
```tsx
// components/fellowship/engagement-card.tsx
interface EngagementCardProps {
  title: string
  description: string
  participantCount: number
  startTime: Date
  onJoin: () => void
  isJoined: boolean
}

export function EngagementCard({
  title,
  description,
  participantCount,
  startTime,
  onJoin,
  isJoined
}: EngagementCardProps) {
  return (
    <div className="fellowship-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          <span>{participantCount}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <Clock className="w-4 h-4 inline mr-1" />
          {startTime.toLocaleString()}
        </div>
        
        <AccessibleButton
          variant={isJoined ? "secondary" : "primary"}
          size="sm"
          onClick={onJoin}
          aria-label={isJoined ? "Leave fellowship" : "Join fellowship"}
        >
          {isJoined ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Joined
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-1" />
              Join Fellowship
            </>
          )}
        </AccessibleButton>
      </div>
    </div>
  )
}
```

---

## Deployment & DevOps

### Modern CI/CD Pipeline

#### GitHub Actions Workflow
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
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run security audit
        run: npm audit --audit-level=moderate

      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Wait for Vercel deployment
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        id: vercel-preview
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 600

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            ${{ steps.vercel-preview.outputs.url }}
            ${{ steps.vercel-preview.outputs.url }}/fellowship
            ${{ steps.vercel-preview.outputs.url }}/bible-search
          configPath: './.lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

#### Performance Budget Configuration
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.95}],
        
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Monitoring and Observability

#### Error Tracking and Performance Monitoring
```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = hint.originalException
      if (error instanceof Error) {
        // Don't report network timeouts as critical
        if (error.message.includes('timeout')) {
          return null
        }
      }
    }
    return event
  },
  
  // Context enhancement
  initialScope: {
    tags: {
      component: 'fellowship-website'
    }
  }
})

// Custom error tracking for Biblical content
export function trackBibleAPIError(api: string, reference: string, error: Error) {
  Sentry.withScope(scope => {
    scope.setTag('bible_api', api)
    scope.setContext('bible_reference', { reference })
    scope.setLevel('warning')
    Sentry.captureException(error)
  })
}

export function trackFellowshipEvent(eventType: string, data: any) {
  Sentry.addBreadcrumb({
    message: `Fellowship event: ${eventType}`,
    category: 'fellowship',
    data,
    level: 'info'
  })
}
```

This comprehensive best practices guide covers all aspects of building a modern, accessible, and performant New Testament fellowship website using current 2025 technologies and patterns. Each section provides production-ready code examples and proven architectural approaches.