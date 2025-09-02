-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  testimony TEXT NOT NULL CHECK (length(testimony) BETWEEN 100 AND 500),
  location TEXT,
  avatar_url TEXT,
  
  -- Verification flags
  email_verified BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  guidelines_accepted BOOLEAN DEFAULT FALSE,
  
  -- Fellowship preferences (JSONB for flexibility)
  fellowship_preferences JSONB DEFAULT '{
    "eventTypes": [],
    "availableTimes": [],
    "studyInterests": [],
    "prayerTopics": []
  }'::jsonb,
  
  favorite_verses TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Community standing
  community_status TEXT DEFAULT 'active' CHECK (community_status IN ('active', 'inactive', 'suspended')),
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

-- Create fellowship events table
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

-- Create fellowship participants table
CREATE TABLE fellowship_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES fellowship_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'leader')),
  UNIQUE(event_id, user_id)
);

-- Create fellowship messages table
CREATE TABLE fellowship_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES fellowship_events(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'prayer', 'scripture')),
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prayer requests table
CREATE TABLE prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  fellowship_event_id UUID REFERENCES fellowship_events(id),
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email_verified ON profiles(email_verified);
CREATE INDEX idx_profiles_profile_completed ON profiles(profile_completed);
CREATE INDEX idx_profiles_community_status ON profiles(community_status);
CREATE INDEX idx_fellowship_events_start_time ON fellowship_events(start_time);
CREATE INDEX idx_fellowship_events_created_by ON fellowship_events(created_by);
CREATE INDEX idx_fellowship_participants_event_id ON fellowship_participants(event_id);
CREATE INDEX idx_fellowship_participants_user_id ON fellowship_participants(user_id);
CREATE INDEX idx_fellowship_messages_event_id ON fellowship_messages(event_id);
CREATE INDEX idx_fellowship_messages_created_at ON fellowship_messages(created_at);
CREATE INDEX idx_prayer_requests_created_by ON prayer_requests(created_by);
CREATE INDEX idx_prayer_requests_created_at ON prayer_requests(created_at);

-- Function to check if user can access fellowship features
CREATE OR REPLACE FUNCTION can_access_fellowship(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND email_verified = TRUE 
    AND profile_completed = TRUE 
    AND guidelines_accepted = TRUE
    AND community_status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Base authentication policy
CREATE POLICY "Authenticated users only" ON profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- Profile access policy
CREATE POLICY "Users can view completed profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    profile_completed = TRUE AND
    email_verified = TRUE
  );

-- Self-profile management
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Fellowship events policies
CREATE POLICY "Fellowship events viewable by authenticated users" ON fellowship_events
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid())
  );

CREATE POLICY "Users can create fellowship events" ON fellowship_events
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid()) AND
    created_by = auth.uid()
  );

CREATE POLICY "Users can update own events" ON fellowship_events
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid()) AND
    created_by = auth.uid()
  );

-- Fellowship participants policies
CREATE POLICY "Participants viewable by event participants" ON fellowship_participants
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid())
  );

CREATE POLICY "Users can join events" ON fellowship_participants
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid()) AND
    user_id = auth.uid()
  );

-- Fellowship messages policies
CREATE POLICY "Messages viewable by event participants" ON fellowship_messages
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid())
  );

CREATE POLICY "Users can send messages" ON fellowship_messages
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid()) AND
    created_by = auth.uid()
  );

-- Prayer requests policies
CREATE POLICY "Prayer requests viewable by fellowship participants" ON prayer_requests
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid())
  );

CREATE POLICY "Users can create prayer requests" ON prayer_requests
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid()) AND
    created_by = auth.uid()
  );

CREATE POLICY "Users can update own prayer requests" ON prayer_requests
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    can_access_fellowship(auth.uid()) AND
    created_by = auth.uid()
  );
