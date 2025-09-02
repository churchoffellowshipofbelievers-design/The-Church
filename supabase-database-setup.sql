-- ===============================================
-- Christian Fellowship Website Database Setup
-- Complete Supabase Database Structure
-- ===============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===============================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ===============================================

CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    display_name TEXT,
    bio TEXT,
    location TEXT,
    fellowship_interests TEXT[] DEFAULT '{}',
    spiritual_gifts TEXT[] DEFAULT '{}',
    availability TEXT, -- JSON string for availability schedule
    profile_image_url TEXT,
    phone TEXT,
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT true,
    is_leader BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. FELLOWSHIP GROUPS TABLE
-- ===============================================

CREATE TABLE public.fellowship_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'bible-study', 'prayer', 'youth', 'seniors', 'mens', 'womens',
        'couples', 'singles', 'small-group', 'ministry', 'outreach'
    )),
    location_type TEXT NOT NULL CHECK (location_type IN ('online', 'in-person', 'hybrid')),
    location TEXT,
    address TEXT,
    meeting_day TEXT CHECK (meeting_day IN (
        'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    )),
    meeting_time TIME,
    meeting_frequency TEXT DEFAULT 'weekly' CHECK (meeting_frequency IN (
        'weekly', 'bi-weekly', 'monthly', 'as-needed'
    )),
    max_members INTEGER DEFAULT 20 CHECK (max_members > 0),
    current_members INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_open_enrollment BOOLEAN DEFAULT true,
    requirements TEXT, -- Any special requirements to join
    contact_info JSONB, -- Phone, email, etc.
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 3. GROUP MEMBERS TABLE
-- ===============================================

CREATE TABLE public.group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.fellowship_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'co-leader', 'member', 'visitor')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    join_reason TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- ===============================================
-- 4. PRAYER REQUESTS TABLE
-- ===============================================

CREATE TABLE public.prayer_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    group_id UUID REFERENCES public.fellowship_groups(id) NULL, -- Can be group-specific or general
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN (
        'healing', 'family', 'guidance', 'provision', 'salvation',
        'strength', 'praise', 'travel', 'work', 'relationships', 'other'
    )),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'closed', 'ongoing')),
    is_anonymous BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true, -- Public to fellowship vs private to group
    answered_date DATE NULL,
    answered_testimony TEXT NULL,
    prayer_count INTEGER DEFAULT 0, -- Number of people who prayed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 5. PRAYER RESPONSES TABLE (who prayed for what)
-- ===============================================

CREATE TABLE public.prayer_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prayer_request_id UUID REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    prayed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    encouragement_note TEXT,
    UNIQUE(prayer_request_id, user_id)
);

-- ===============================================
-- 6. BIBLE STUDY SESSIONS TABLE
-- ===============================================

CREATE TABLE public.bible_study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.fellowship_groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scripture_reference TEXT NOT NULL, -- e.g., "Matthew 5:1-12"
    study_book TEXT, -- Book being studied
    chapter_verse TEXT, -- Specific chapter/verse
    study_notes TEXT,
    main_points TEXT[],
    discussion_questions TEXT[],
    homework TEXT,
    resources JSONB, -- Links to study materials
    session_date DATE NOT NULL,
    session_number INTEGER, -- Session in sequence
    duration_minutes INTEGER DEFAULT 60,
    leader_id UUID REFERENCES public.users(id),
    attendance_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 7. EVENTS TABLE
-- ===============================================

CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.fellowship_groups(id) NULL, -- Can be group-specific or church-wide
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN (
        'meeting', 'bible-study', 'prayer', 'social', 'outreach',
        'conference', 'retreat', 'service', 'fellowship', 'worship'
    )),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    all_day BOOLEAN DEFAULT false,
    location TEXT,
    address TEXT,
    online_link TEXT, -- Zoom, Google Meet, etc.
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT false,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    cost DECIMAL(10,2) DEFAULT 0.00,
    contact_person UUID REFERENCES public.users(id),
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB, -- How often it repeats
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 8. EVENT REGISTRATIONS TABLE
-- ===============================================

CREATE TABLE public.event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN (
        'registered', 'attended', 'no-show', 'cancelled'
    )),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- ===============================================
-- 9. PRAYER JOURNAL TABLE (personal prayer tracking)
-- ===============================================

CREATE TABLE public.prayer_journal (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT,
    prayer_text TEXT NOT NULL,
    category TEXT CHECK (category IN (
        'praise', 'petition', 'intercession', 'confession', 'thanksgiving', 'meditation'
    )),
    scripture_reference TEXT,
    is_answered BOOLEAN DEFAULT false,
    answered_date DATE NULL,
    answered_notes TEXT NULL,
    is_favorite BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 10. SPIRITUAL GROWTH TRACKING TABLE
-- ===============================================

CREATE TABLE public.spiritual_growth (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'bible_reading_days', 'prayer_minutes', 'fellowship_attendance',
        'service_hours', 'scripture_memorized', 'devotional_days',
        'worship_attendance', 'bible_study_sessions'
    )),
    metric_value INTEGER NOT NULL CHECK (metric_value >= 0),
    metric_date DATE DEFAULT CURRENT_DATE,
    goal_value INTEGER, -- Personal goal for this metric
    notes TEXT,
    scripture_reference TEXT, -- If applicable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, metric_type, metric_date)
);

-- ===============================================
-- 11. TESTIMONIES TABLE
-- ===============================================

CREATE TABLE public.testimonies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN (
        'salvation', 'healing', 'provision', 'guidance', 'deliverance',
        'answered_prayer', 'spiritual_growth', 'fellowship', 'other'
    )),
    scripture_reference TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.users(id) NULL,
    approved_at TIMESTAMP WITH TIME ZONE NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 12. RESOURCE LIBRARY TABLE
-- ===============================================

CREATE TABLE public.resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT CHECK (resource_type IN (
        'article', 'book', 'video', 'audio', 'study-guide',
        'devotional', 'bible-study', 'sermon', 'music', 'other'
    )),
    category TEXT CHECK (category IN (
        'bible-study', 'prayer', 'discipleship', 'evangelism', 'worship',
        'family', 'youth', 'leadership', 'theology', 'apologetics'
    )),
    url TEXT,
    file_path TEXT, -- If hosted locally
    author TEXT,
    scripture_references TEXT[],
    tags TEXT[] DEFAULT '{}',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time_minutes INTEGER,
    downloads_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- INDEXES for Performance
-- ===============================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_full_name ON public.users(full_name);
CREATE INDEX idx_users_location ON public.users(location);

-- Fellowship groups indexes
CREATE INDEX idx_fellowship_groups_category ON public.fellowship_groups(category);
CREATE INDEX idx_fellowship_groups_location_type ON public.fellowship_groups(location_type);
CREATE INDEX idx_fellowship_groups_is_active ON public.fellowship_groups(is_active);
CREATE INDEX idx_fellowship_groups_created_by ON public.fellowship_groups(created_by);

-- Prayer requests indexes
CREATE INDEX idx_prayer_requests_user_id ON public.prayer_requests(user_id);
CREATE INDEX idx_prayer_requests_category ON public.prayer_requests(category);
CREATE INDEX idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX idx_prayer_requests_created_at ON public.prayer_requests(created_at DESC);

-- Events indexes
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_event_type ON public.events(event_type);
CREATE INDEX idx_events_group_id ON public.events(group_id);

-- Bible study indexes
CREATE INDEX idx_bible_study_sessions_group_id ON public.bible_study_sessions(group_id);
CREATE INDEX idx_bible_study_sessions_session_date ON public.bible_study_sessions(session_date DESC);

-- Prayer journal indexes
CREATE INDEX idx_prayer_journal_user_id ON public.prayer_journal(user_id);
CREATE INDEX idx_prayer_journal_created_at ON public.prayer_journal(created_at DESC);

-- Spiritual growth indexes
CREATE INDEX idx_spiritual_growth_user_id ON public.spiritual_growth(user_id);
CREATE INDEX idx_spiritual_growth_metric_date ON public.spiritual_growth(metric_date DESC);

-- ===============================================
-- TRIGGERS for automatic timestamps
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fellowship_groups_updated_at 
    BEFORE UPDATE ON public.fellowship_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at 
    BEFORE UPDATE ON public.prayer_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bible_study_sessions_updated_at 
    BEFORE UPDATE ON public.bible_study_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON public.events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_journal_updated_at 
    BEFORE UPDATE ON public.prayer_journal 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonies_updated_at 
    BEFORE UPDATE ON public.testimonies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at 
    BEFORE UPDATE ON public.resources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '🎉 Christian Fellowship Database Setup Complete!';
    RAISE NOTICE '✅ Created 12 tables with proper relationships';
    RAISE NOTICE '✅ Added performance indexes';
    RAISE NOTICE '✅ Set up automatic timestamp triggers';
    RAISE NOTICE '🔐 Next: Run the RLS security policies script';
END $$;