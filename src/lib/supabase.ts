import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          email: string
          bio: string | null
          testimony: string
          location: string | null
          avatar_url: string | null
          email_verified: boolean
          profile_completed: boolean
          guidelines_accepted: boolean
          fellowship_preferences: Record<string, unknown>
          favorite_verses: string[] | null
          created_at: string
          updated_at: string
          last_seen_at: string
          community_status: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          email: string
          bio?: string | null
          testimony: string
          location?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          profile_completed?: boolean
          guidelines_accepted?: boolean
          fellowship_preferences?: Record<string, unknown>
          favorite_verses?: string[] | null
          created_at?: string
          updated_at?: string
          last_seen_at?: string
          community_status?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          email?: string
          bio?: string | null
          testimony?: string
          location?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          profile_completed?: boolean
          guidelines_accepted?: boolean
          fellowship_preferences?: Record<string, unknown>
          favorite_verses?: string[] | null
          created_at?: string
          updated_at?: string
          last_seen_at?: string
          community_status?: string
        }
      }
      fellowship_events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string
          start_time: string
          end_time: string
          max_participants: number | null
          is_public: boolean
          recurring_pattern: string | null
          recurring_until: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type?: string
          start_time: string
          end_time: string
          max_participants?: number | null
          is_public?: boolean
          recurring_pattern?: string | null
          recurring_until?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: string
          start_time?: string
          end_time?: string
          max_participants?: number | null
          is_public?: boolean
          recurring_pattern?: string | null
          recurring_until?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      fellowship_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          joined_at: string
          role: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          joined_at?: string
          role?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          joined_at?: string
          role?: string
        }
      }
      fellowship_messages: {
        Row: {
          id: string
          event_id: string | null
          message: string
          message_type: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          message: string
          message_type?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          message?: string
          message_type?: string
          created_by?: string
          created_at?: string
        }
      }
      prayer_requests: {
        Row: {
          id: string
          title: string
          description: string | null
          is_anonymous: boolean
          fellowship_event_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_anonymous?: boolean
          fellowship_event_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_anonymous?: boolean
          fellowship_event_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
