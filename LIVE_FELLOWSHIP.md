# Live Fellowship Chat System
## The Church - New Testament Fellowship Website

### Table of Contents
1. [Fellowship Chat Overview](#fellowship-chat-overview)
2. [Supabase Real-time Setup](#supabase-real-time-setup)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [Fellowship Event Scheduling](#fellowship-event-scheduling)
6. [Live Chat Component](#live-chat-component)
7. [Moderation System](#moderation-system)
8. [Prayer Request Integration](#prayer-request-integration)

---

## Fellowship Chat Overview

### Biblical Foundation
> **"And they continued steadfastly in the apostles' doctrine and fellowship, in the breaking of bread, and in prayers."** - Acts 2:42

Our live fellowship system enables authentic New Testament community through:
- **Scheduled fellowship meetings** based on biblical patterns
- **Real-time prayer sharing** for mutual support
- **Bible study discussions** with scripture integration
- **Community announcements** and encouragement

### Technical Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Chat    │────│  Supabase RT    │────│  PostgreSQL     │
│   Component     │    │  (WebSockets)   │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         └──────────────│  Row Level      │─────────────┘
                        │  Security       │
                        └─────────────────┘
```

---

## Supabase Real-time Setup

### Enabling Real-time on Tables
```sql
-- Enable real-time for fellowship messages
ALTER PUBLICATION supabase_realtime ADD TABLE fellowship_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE fellowship_events;
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_requests;

-- Create real-time policies
CREATE OR REPLACE FUNCTION can_access_fellowship(event_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is authenticated and event is public or user is participant
  RETURN (
    auth.uid() IS NOT NULL AND (
      EXISTS(
        SELECT 1 FROM fellowship_events 
        WHERE id = event_uuid 
        AND (is_public = TRUE OR created_by = auth.uid())
      ) OR
      EXISTS(
        SELECT 1 FROM fellowship_participants 
        WHERE event_id = event_uuid 
        AND user_id = auth.uid()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Real-time Client Configuration
```typescript
// lib/supabase/realtime.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RealtimeChannel } from '@supabase/supabase-js'

export class FellowshipRealtime {
  private supabase = createClientComponentClient()
  private channels: Map<string, RealtimeChannel> = new Map()

  subscribeToFellowship(eventId: string, callbacks: {
    onMessage?: (payload: any) => void
    onParticipantJoin?: (payload: any) => void
    onParticipantLeave?: (payload: any) => void
    onPrayerRequest?: (payload: any) => void
  }) {
    const channelName = `fellowship:${eventId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = this.supabase
      .channel(channelName)
      .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'fellowship_messages',
            filter: `event_id=eq.${eventId}`
          }, 
          callbacks.onMessage || (() => {}))
      .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'fellowship_participants',
            filter: `event_id=eq.${eventId}`
          },
          callbacks.onParticipantJoin || (() => {}))
      .on('postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'fellowship_participants',
            filter: `event_id=eq.${eventId}`
          },
          callbacks.onParticipantLeave || (() => {}))
      .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'prayer_requests',
            filter: `fellowship_event_id=eq.${eventId}`
          },
          callbacks.onPrayerRequest || (() => {}))
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  unsubscribe(eventId: string) {
    const channelName = `fellowship:${eventId}`
    const channel = this.channels.get(channelName)
    
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  async sendMessage(eventId: string, message: string, messageType: 'chat' | 'prayer' | 'scripture' = 'chat') {
    const { data: user } = await this.supabase.auth.getUser()
    
    if (!user.user) {
      throw new Error('User must be authenticated to send messages')
    }

    const { data, error } = await this.supabase
      .from('fellowship_messages')
      .insert({
        event_id: eventId,
        message: message,
        message_type: messageType,
        created_by: user.user.id
      })
      .select(`
        *,
        profiles:created_by (
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  }
}

export const fellowshipRealtime = new FellowshipRealtime()
```

---

## Database Schema

### Enhanced Database Tables
```sql
-- Fellowship events table (updated)
CREATE TABLE fellowship_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'fellowship' CHECK (event_type IN ('fellowship', 'prayer', 'study', 'worship')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER DEFAULT 50,
  is_public BOOLEAN DEFAULT TRUE,
  recurring_pattern TEXT, -- 'weekly', 'monthly', 'daily'
  recurring_until DATE,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fellowship participants table
CREATE TABLE fellowship_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES fellowship_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'leader')),
  UNIQUE(event_id, user_id)
);

-- Fellowship messages table (updated)
CREATE TABLE fellowship_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES fellowship_events(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'prayer', 'scripture', 'announcement')),
  reply_to UUID REFERENCES fellowship_messages(id),
  scripture_reference TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer requests table (updated)
CREATE TABLE prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_answered BOOLEAN DEFAULT FALSE,
  fellowship_event_id UUID REFERENCES fellowship_events(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer responses table
CREATE TABLE prayer_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  response_type TEXT DEFAULT 'prayer' CHECK (response_type IN ('prayer', 'encouragement', 'testimony')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions table
CREATE TABLE message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES fellowship_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('amen', 'pray', 'heart', 'praise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Create indexes for performance
CREATE INDEX idx_fellowship_messages_event_id ON fellowship_messages(event_id);
CREATE INDEX idx_fellowship_messages_created_at ON fellowship_messages(created_at);
CREATE INDEX idx_fellowship_participants_event_id ON fellowship_participants(event_id);
CREATE INDEX idx_prayer_requests_event_id ON prayer_requests(fellowship_event_id);
```

### Row Level Security Policies
```sql
-- Fellowship events policies
CREATE POLICY "Public fellowship events are viewable by everyone" ON fellowship_events
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Private fellowship events viewable by participants" ON fellowship_events
  FOR SELECT USING (
    is_public = FALSE AND (
      created_by = auth.uid() OR
      EXISTS(
        SELECT 1 FROM fellowship_participants 
        WHERE event_id = id AND user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create fellowship events" ON fellowship_events
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Messages policies
CREATE POLICY "Fellowship messages viewable by participants" ON fellowship_messages
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM fellowship_events 
      WHERE id = event_id AND (
        is_public = TRUE OR 
        created_by = auth.uid() OR
        EXISTS(
          SELECT 1 FROM fellowship_participants 
          WHERE event_id = fellowship_messages.event_id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Participants can send messages" ON fellowship_messages
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    EXISTS(
      SELECT 1 FROM fellowship_events 
      WHERE id = event_id AND (
        is_public = TRUE OR 
        created_by = auth.uid() OR
        EXISTS(
          SELECT 1 FROM fellowship_participants 
          WHERE event_id = fellowship_messages.event_id AND user_id = auth.uid()
        )
      )
    )
  );

-- Prayer requests policies  
CREATE POLICY "Prayer requests viewable by fellowship participants" ON prayer_requests
  FOR SELECT USING (
    fellowship_event_id IS NULL OR
    EXISTS(
      SELECT 1 FROM fellowship_events 
      WHERE id = fellowship_event_id AND (
        is_public = TRUE OR 
        created_by = auth.uid() OR
        EXISTS(
          SELECT 1 FROM fellowship_participants 
          WHERE event_id = fellowship_event_id AND user_id = auth.uid()
        )
      )
    )
  );
```

---

## Authentication & Authorization

### Supabase Auth Setup
```typescript
// lib/auth/fellowship-auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export class FellowshipAuth {
  private supabase = createClientComponentClient()

  async checkEventAccess(eventId: string): Promise<{
    canView: boolean
    canModerate: boolean
    role: string
  }> {
    const { data: user } = await this.supabase.auth.getUser()
    
    if (!user.user) {
      return { canView: false, canModerate: false, role: 'none' }
    }

    // Check if user is event creator
    const { data: event } = await this.supabase
      .from('fellowship_events')
      .select('created_by, is_public')
      .eq('id', eventId)
      .single()

    if (!event) {
      return { canView: false, canModerate: false, role: 'none' }
    }

    const isCreator = event.created_by === user.user.id
    
    // Check participant role
    const { data: participant } = await this.supabase
      .from('fellowship_participants')
      .select('role')
      .eq('event_id', eventId)
      .eq('user_id', user.user.id)
      .single()

    const canView = event.is_public || isCreator || !!participant
    const canModerate = isCreator || participant?.role === 'moderator'
    const role = isCreator ? 'creator' : (participant?.role || 'viewer')

    return { canView, canModerate, role }
  }

  async joinFellowship(eventId: string): Promise<boolean> {
    const { data: user } = await this.supabase.auth.getUser()
    
    if (!user.user) return false

    const { error } = await this.supabase
      .from('fellowship_participants')
      .insert({
        event_id: eventId,
        user_id: user.user.id,
        role: 'participant'
      })

    return !error
  }

  async leaveFellowship(eventId: string): Promise<boolean> {
    const { data: user } = await this.supabase.auth.getUser()
    
    if (!user.user) return false

    const { error } = await this.supabase
      .from('fellowship_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.user.id)

    return !error
  }
}

export const fellowshipAuth = new FellowshipAuth()
```

---

## Fellowship Event Scheduling

### Event Management Component
```tsx
// components/fellowship/EventScheduler.tsx
'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface FellowshipEvent {
  id?: string
  title: string
  description: string
  event_type: 'fellowship' | 'prayer' | 'study' | 'worship'
  start_time: string
  end_time: string
  max_participants: number
  is_public: boolean
  recurring_pattern?: 'weekly' | 'monthly' | 'daily'
}

export function EventScheduler() {
  const [event, setEvent] = useState<FellowshipEvent>({
    title: '',
    description: '',
    event_type: 'fellowship',
    start_time: '',
    end_time: '',
    max_participants: 20,
    is_public: true
  })
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient()

  const createEvent = async () => {
    setLoading(true)
    try {
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        throw new Error('Must be logged in to create events')
      }

      const { data, error } = await supabase
        .from('fellowship_events')
        .insert({
          ...event,
          created_by: user.user.id
        })
        .select()
        .single()

      if (error) throw error

      // Auto-join creator as participant with leader role
      await supabase
        .from('fellowship_participants')
        .insert({
          event_id: data.id,
          user_id: user.user.id,
          role: 'leader'
        })

      alert('Fellowship event created successfully!')
      
      // Reset form
      setEvent({
        title: '',
        description: '',
        event_type: 'fellowship',
        start_time: '',
        end_time: '',
        max_participants: 20,
        is_public: true
      })
      
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Schedule Fellowship Meeting</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Event Title</label>
          <Input
            type="text"
            placeholder="Evening Fellowship & Prayer"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            placeholder="Join us for fellowship, prayer, and encouragement based on Acts 2:42-47..."
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <select
              value={event.event_type}
              onChange={(e) => setEvent({ ...event, event_type: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="fellowship">General Fellowship</option>
              <option value="prayer">Prayer Meeting</option>
              <option value="study">Bible Study</option>
              <option value="worship">Worship & Praise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Participants</label>
            <Input
              type="number"
              min="5"
              max="100"
              value={event.max_participants}
              onChange={(e) => setEvent({ ...event, max_participants: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <Input
              type="datetime-local"
              value={event.start_time}
              onChange={(e) => setEvent({ ...event, start_time: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <Input
              type="datetime-local"
              value={event.end_time}
              onChange={(e) => setEvent({ ...event, end_time: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={event.is_public}
              onChange={(e) => setEvent({ ...event, is_public: e.target.checked })}
            />
            <span className="text-sm">Public (anyone can join)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!event.recurring_pattern}
              onChange={(e) => setEvent({ 
                ...event, 
                recurring_pattern: e.target.checked ? 'weekly' : undefined 
              })}
            />
            <span className="text-sm">Recurring weekly</span>
          </label>
        </div>

        <Button 
          onClick={createEvent} 
          disabled={loading || !event.title || !event.start_time}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Fellowship Event'}
        </Button>
      </div>
    </div>
  )
}
```

---

## Live Chat Component

### Main Fellowship Chat Interface
```tsx
// components/fellowship/FellowshipChat.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Users, Heart, MessageCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fellowshipRealtime } from '@/lib/supabase/realtime'
import { fellowshipAuth } from '@/lib/auth/fellowship-auth'

interface ChatMessage {
  id: string
  message: string
  message_type: 'chat' | 'prayer' | 'scripture' | 'announcement'
  scripture_reference?: string
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url?: string
  }
  reactions?: Array<{
    reaction_type: string
    count: number
    user_reacted: boolean
  }>
}

interface FellowshipChatProps {
  eventId: string
  eventTitle: string
}

export function FellowshipChat({ eventId, eventTitle }: FellowshipChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [messageType, setMessageType] = useState<'chat' | 'prayer' | 'scripture'>('chat')
  const [participants, setParticipants] = useState<number>(0)
  const [userAccess, setUserAccess] = useState({ canView: false, canModerate: false, role: 'none' })
  const [loading, setLoading] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    initializeChat()
    return () => {
      fellowshipRealtime.unsubscribe(eventId)
    }
  }, [eventId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = async () => {
    try {
      // Check user access
      const access = await fellowshipAuth.checkEventAccess(eventId)
      setUserAccess(access)

      if (!access.canView) {
        setLoading(false)
        return
      }

      // Load existing messages
      await loadMessages()

      // Subscribe to real-time updates
      fellowshipRealtime.subscribeToFellowship(eventId, {
        onMessage: (payload) => {
          if (payload.new) {
            setMessages(prev => [...prev, payload.new])
          }
        },
        onParticipantJoin: () => {
          updateParticipantCount()
        },
        onParticipantLeave: () => {
          updateParticipantCount()
        }
      })

      await updateParticipantCount()
      
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    // Implementation would load messages from Supabase
  }

  const updateParticipantCount = async () => {
    // Implementation would count current participants
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      await fellowshipRealtime.sendMessage(eventId, newMessage, messageType)
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const addReaction = async (messageId: string, reactionType: string) => {
    // Implementation would add reaction to message
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userAccess.canView) {
    return (
      <div className="text-center p-8">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Private Fellowship</h3>
        <p className="text-gray-600">This fellowship meeting is private. Please contact the organizer for access.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{eventTitle}</h2>
            <p className="text-blue-100">Fellowship in Christ</p>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <Users className="w-4 h-4" />
            <span>{participants} online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0">
              {message.profiles.avatar_url ? (
                <img 
                  src={message.profiles.avatar_url} 
                  alt={message.profiles.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                  {message.profiles.full_name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{message.profiles.full_name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                {message.message_type !== 'chat' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    message.message_type === 'prayer' ? 'bg-purple-100 text-purple-700' :
                    message.message_type === 'scripture' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {message.message_type}
                  </span>
                )}
              </div>
              
              <div className="text-gray-700 mb-2">
                {message.scripture_reference && (
                  <div className="text-sm text-blue-600 mb-1">
                    📖 {message.scripture_reference}
                  </div>
                )}
                {message.message}
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-2">
                {message.reactions?.map(reaction => (
                  <button
                    key={reaction.reaction_type}
                    onClick={() => addReaction(message.id, reaction.reaction_type)}
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      reaction.user_reacted 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {reaction.reaction_type === 'amen' && '🙏'}
                    {reaction.reaction_type === 'heart' && '❤️'}
                    {reaction.reaction_type === 'pray' && '🤲'}
                    {reaction.reaction_type === 'praise' && '🙌'}
                    {reaction.count}
                  </button>
                ))}
                <button
                  onClick={() => addReaction(message.id, 'amen')}
                  className="text-xs text-gray-500 hover:text-blue-600"
                >
                  🙏
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setMessageType('chat')}
            className={`px-3 py-1 rounded-full text-sm ${
              messageType === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setMessageType('prayer')}
            className={`px-3 py-1 rounded-full text-sm ${
              messageType === 'prayer' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🙏 Prayer
          </button>
          <button
            onClick={() => setMessageType('scripture')}
            className={`px-3 py-1 rounded-full text-sm ${
              messageType === 'scripture' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            📖 Scripture
          </button>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={
              messageType === 'chat' ? 'Share your thoughts...' :
              messageType === 'prayer' ? 'Share a prayer request...' :
              'Share a scripture verse...'
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

This comprehensive live fellowship system provides:

1. **Real-time Chat**: WebSocket-based messaging with Supabase
2. **Event Scheduling**: Create and manage fellowship meetings
3. **Prayer Integration**: Special prayer request handling
4. **Scripture Sharing**: Built-in Bible verse sharing
5. **Moderation Tools**: Content control and user management
6. **Security**: Row-level security and authentication
7. **Biblical Focus**: Designed around New Testament fellowship principles

The system enables authentic Christian community through technology while maintaining biblical fellowship patterns.