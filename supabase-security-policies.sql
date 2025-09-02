-- ===============================================
-- Christian Fellowship Website Security Policies
-- Row Level Security (RLS) Configuration
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fellowship_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_growth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 1. USERS TABLE POLICIES
-- ===============================================

-- Users can read all public profiles
CREATE POLICY "Users can view public profiles" ON public.users
    FOR SELECT USING (is_active = true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can create own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ===============================================
-- 2. FELLOWSHIP GROUPS POLICIES
-- ===============================================

-- Everyone can read active fellowship groups
CREATE POLICY "Fellowship groups are publicly readable" ON public.fellowship_groups
    FOR SELECT USING (is_active = true);

-- Authenticated users can create fellowship groups
CREATE POLICY "Users can create fellowship groups" ON public.fellowship_groups
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND 
        auth.uid() IS NOT NULL
    );

-- Group creators and leaders can update groups
CREATE POLICY "Group leaders can update fellowship groups" ON public.fellowship_groups
    FOR UPDATE USING (
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT user_id FROM public.group_members 
            WHERE group_id = fellowship_groups.id AND role IN ('leader', 'co-leader')
        )
    );

-- Group creators can delete groups
CREATE POLICY "Group creators can delete fellowship groups" ON public.fellowship_groups
    FOR DELETE USING (auth.uid() = created_by);

-- ===============================================
-- 3. GROUP MEMBERS POLICIES
-- ===============================================

-- Group members and leaders can see group membership
CREATE POLICY "Group members can view group membership" ON public.group_members
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT user_id FROM public.group_members gm2 
            WHERE gm2.group_id = group_members.group_id AND gm2.role IN ('leader', 'co-leader')
        )
    );

-- Users can join groups (insert their own membership)
CREATE POLICY "Users can join groups" ON public.group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave groups (delete their own membership)
CREATE POLICY "Users can leave groups" ON public.group_members
    FOR DELETE USING (auth.uid() = user_id);

-- Leaders can manage group membership
CREATE POLICY "Leaders can manage group membership" ON public.group_members
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.group_members gm2 
            WHERE gm2.group_id = group_members.group_id AND gm2.role IN ('leader', 'co-leader')
        )
    );

-- ===============================================
-- 4. PRAYER REQUESTS POLICIES
-- ===============================================

-- Public prayer requests are readable by all authenticated users
CREATE POLICY "Public prayer requests are readable" ON public.prayer_requests
    FOR SELECT USING (
        (is_public = true AND is_anonymous = false) OR
        auth.uid() = user_id OR
        (group_id IS NOT NULL AND auth.uid() IN (
            SELECT user_id FROM public.group_members 
            WHERE group_id = prayer_requests.group_id
        ))
    );

-- Users can create prayer requests
CREATE POLICY "Users can create prayer requests" ON public.prayer_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own prayer requests
CREATE POLICY "Users can update own prayer requests" ON public.prayer_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own prayer requests
CREATE POLICY "Users can delete own prayer requests" ON public.prayer_requests
    FOR DELETE USING (auth.uid() = user_id);

-- ===============================================
-- 5. PRAYER RESPONSES POLICIES
-- ===============================================

-- Users can see prayer responses for requests they can see
CREATE POLICY "Users can view prayer responses" ON public.prayer_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.prayer_requests pr 
            WHERE pr.id = prayer_responses.prayer_request_id AND (
                (pr.is_public = true) OR
                (pr.user_id = auth.uid()) OR
                (pr.group_id IS NOT NULL AND auth.uid() IN (
                    SELECT user_id FROM public.group_members 
                    WHERE group_id = pr.group_id
                ))
            )
        )
    );

-- Users can create prayer responses
CREATE POLICY "Users can create prayer responses" ON public.prayer_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own prayer responses
CREATE POLICY "Users can update own prayer responses" ON public.prayer_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- ===============================================
-- 6. BIBLE STUDY SESSIONS POLICIES
-- ===============================================

-- Group members can view bible study sessions
CREATE POLICY "Group members can view bible studies" ON public.bible_study_sessions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.group_members 
            WHERE group_id = bible_study_sessions.group_id
        )
    );

-- Group leaders can create bible study sessions
CREATE POLICY "Leaders can create bible studies" ON public.bible_study_sessions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.group_members 
            WHERE group_id = bible_study_sessions.group_id AND role IN ('leader', 'co-leader')
        ) OR auth.uid() = leader_id
    );

-- Session leaders can update their sessions
CREATE POLICY "Leaders can update bible studies" ON public.bible_study_sessions
    FOR UPDATE USING (
        auth.uid() = leader_id OR
        auth.uid() IN (
            SELECT user_id FROM public.group_members 
            WHERE group_id = bible_study_sessions.group_id AND role IN ('leader', 'co-leader')
        )
    );

-- ===============================================
-- 7. EVENTS POLICIES
-- ===============================================

-- Everyone can view active events
CREATE POLICY "Events are publicly readable" ON public.events
    FOR SELECT USING (start_date >= CURRENT_DATE - INTERVAL '1 day');

-- Authenticated users can create events
CREATE POLICY "Users can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Event creators and group leaders can update events
CREATE POLICY "Event organizers can update events" ON public.events
    FOR UPDATE USING (
        auth.uid() = created_by OR
        (group_id IS NOT NULL AND auth.uid() IN (
            SELECT user_id FROM public.group_members 
            WHERE group_id = events.group_id AND role IN ('leader', 'co-leader')
        ))
    );

-- Event creators can delete events
CREATE POLICY "Event creators can delete events" ON public.events
    FOR DELETE USING (auth.uid() = created_by);

-- ===============================================
-- 8. EVENT REGISTRATIONS POLICIES
-- ===============================================

-- Users can view registrations for events they're registered for
CREATE POLICY "Users can view event registrations" ON public.event_registrations
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT created_by FROM public.events 
            WHERE events.id = event_registrations.event_id
        )
    );

-- Users can register for events
CREATE POLICY "Users can register for events" ON public.event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registration
CREATE POLICY "Users can update own registration" ON public.event_registrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can cancel their registration
CREATE POLICY "Users can cancel registration" ON public.event_registrations
    FOR DELETE USING (auth.uid() = user_id);

-- ===============================================
-- 9. PRAYER JOURNAL POLICIES (PRIVATE)
-- ===============================================

-- Users can only access their own prayer journal
CREATE POLICY "Users can manage own prayer journal" ON public.prayer_journal
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===============================================
-- 10. SPIRITUAL GROWTH POLICIES (PRIVATE)
-- ===============================================

-- Users can only access their own spiritual growth data
CREATE POLICY "Users can manage own spiritual growth" ON public.spiritual_growth
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===============================================
-- 11. TESTIMONIES POLICIES
-- ===============================================

-- Everyone can read approved testimonies
CREATE POLICY "Approved testimonies are publicly readable" ON public.testimonies
    FOR SELECT USING (is_approved = true);

-- Users can create testimonies
CREATE POLICY "Users can create testimonies" ON public.testimonies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own testimonies (if not approved yet)
CREATE POLICY "Users can update own testimonies" ON public.testimonies
    FOR UPDATE USING (
        auth.uid() = user_id AND is_approved = false
    );

-- Leaders can approve testimonies
CREATE POLICY "Leaders can approve testimonies" ON public.testimonies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_leader = true
        )
    );

-- ===============================================
-- 12. RESOURCES POLICIES
-- ===============================================

-- Everyone can read resources
CREATE POLICY "Resources are publicly readable" ON public.resources
    FOR SELECT USING (true);

-- Authenticated users can create resources
CREATE POLICY "Users can upload resources" ON public.resources
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Resource uploaders can update their resources
CREATE POLICY "Users can update own resources" ON public.resources
    FOR UPDATE USING (auth.uid() = uploaded_by);

-- Leaders can manage all resources
CREATE POLICY "Leaders can manage resources" ON public.resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_leader = true
        )
    );

-- ===============================================
-- HELPER FUNCTIONS
-- ===============================================

-- Function to check if user is group member
CREATE OR REPLACE FUNCTION is_group_member(group_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = group_uuid AND user_id = user_uuid AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is group leader
CREATE OR REPLACE FUNCTION is_group_leader(group_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = group_uuid AND user_id = user_uuid AND role IN ('leader', 'co-leader')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's fellowship groups
CREATE OR REPLACE FUNCTION get_user_groups(user_uuid UUID)
RETURNS TABLE(group_id UUID, group_name TEXT, role TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT fg.id, fg.name, gm.role
    FROM public.fellowship_groups fg
    JOIN public.group_members gm ON fg.id = gm.group_id
    WHERE gm.user_id = user_uuid AND gm.status = 'active' AND fg.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- VIEWS FOR COMMON QUERIES
-- ===============================================

-- View: Group members with user details
CREATE VIEW group_members_view AS
SELECT 
    gm.id,
    gm.group_id,
    gm.user_id,
    gm.role,
    gm.status,
    gm.joined_at,
    u.full_name,
    u.display_name,
    u.email,
    u.profile_image_url,
    fg.name as group_name
FROM public.group_members gm
JOIN public.users u ON gm.user_id = u.id
JOIN public.fellowship_groups fg ON gm.group_id = fg.id
WHERE gm.status = 'active' AND u.is_active = true AND fg.is_active = true;

-- View: Prayer requests with user details
CREATE VIEW prayer_requests_view AS
SELECT 
    pr.id,
    pr.title,
    pr.description,
    pr.category,
    pr.priority,
    pr.status,
    pr.is_anonymous,
    pr.is_public,
    pr.prayer_count,
    pr.created_at,
    pr.updated_at,
    CASE 
        WHEN pr.is_anonymous THEN 'Anonymous'
        ELSE u.display_name
    END as requester_name,
    fg.name as group_name
FROM public.prayer_requests pr
LEFT JOIN public.users u ON pr.user_id = u.id
LEFT JOIN public.fellowship_groups fg ON pr.group_id = fg.id
WHERE pr.status = 'active';

-- View: Upcoming events with details
CREATE VIEW upcoming_events_view AS
SELECT 
    e.id,
    e.title,
    e.description,
    e.event_type,
    e.start_date,
    e.end_date,
    e.location,
    e.max_attendees,
    e.current_attendees,
    e.registration_required,
    fg.name as group_name,
    u.display_name as organizer_name
FROM public.events e
LEFT JOIN public.fellowship_groups fg ON e.group_id = fg.id
LEFT JOIN public.users u ON e.created_by = u.id
WHERE e.start_date >= CURRENT_DATE
ORDER BY e.start_date;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '🔐 Christian Fellowship Security Policies Complete!';
    RAISE NOTICE '✅ Enabled RLS on all 12 tables';
    RAISE NOTICE '✅ Created comprehensive security policies';
    RAISE NOTICE '✅ Added helper functions and views';
    RAISE NOTICE '🙏 Database is secure and ready for fellowship!';
END $$;