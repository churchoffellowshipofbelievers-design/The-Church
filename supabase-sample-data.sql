-- ===============================================
-- Christian Fellowship Website Sample Data
-- Test data for development and demonstration
-- ===============================================

-- Note: This script should be run AFTER setting up authentication
-- You'll need actual user IDs from Supabase Auth

-- ===============================================
-- 1. SAMPLE USERS (extends auth.users)
-- ===============================================

-- Insert sample user profiles
-- Note: Replace these UUIDs with actual auth.users IDs after user registration

INSERT INTO public.users (id, email, full_name, display_name, bio, location, fellowship_interests, spiritual_gifts, is_leader) VALUES
-- Sample Leader
('00000000-0000-0000-0000-000000000001', 'pastor.john@fellowship.org', 'Pastor John Smith', 'Pastor John', 'Passionate about building authentic Christian community and discipleship.', 'Austin, TX', 
 ARRAY['bible-study', 'leadership', 'prayer'], ARRAY['teaching', 'leadership', 'pastoring'], true),

-- Sample Users
('00000000-0000-0000-0000-000000000002', 'mary.johnson@email.com', 'Mary Johnson', 'Mary J', 'Mother of two, loves studying Scripture and prayer ministry.', 'Austin, TX',
 ARRAY['prayer', 'womens', 'bible-study'], ARRAY['intercession', 'mercy'], false),

('00000000-0000-0000-0000-000000000003', 'david.wilson@email.com', 'David Wilson', 'Dave', 'Young professional seeking to grow in faith and fellowship.', 'Round Rock, TX',
 ARRAY['mens', 'bible-study', 'youth'], ARRAY['evangelism', 'helps'], false),

('00000000-0000-0000-0000-000000000004', 'sarah.brown@email.com', 'Sarah Brown', 'Sarah', 'College student passionate about worship and youth ministry.', 'Austin, TX',
 ARRAY['youth', 'worship', 'outreach'], ARRAY['worship', 'exhortation'], false),

('00000000-0000-0000-0000-000000000005', 'michael.davis@email.com', 'Michael Davis', 'Mike', 'Family man interested in couples ministry and community outreach.', 'Cedar Park, TX',
 ARRAY['couples', 'outreach', 'mens'], ARRAY['giving', 'administration'], false);

-- ===============================================
-- 2. SAMPLE FELLOWSHIP GROUPS
-- ===============================================

INSERT INTO public.fellowship_groups (id, name, description, category, location_type, location, meeting_day, meeting_time, max_members, created_by) VALUES

('10000000-1000-1000-1000-100000000001', 'Downtown Bible Study', 
 'Weekly expository Bible study focusing on verse-by-verse teaching. Currently studying the Gospel of John. Perfect for believers who want to dig deeper into God''s Word.',
 'bible-study', 'in-person', 'Community Center Downtown', 'wednesday', '19:00:00', 15,
 '00000000-0000-0000-0000-000000000001'),

('10000000-1000-1000-1000-100000000002', 'Wednesday Prayer Warriors', 
 'Dedicated prayer group that meets weekly to intercede for our community, nation, and world. We believe in the power of united prayer.',
 'prayer', 'hybrid', 'First Baptist Church', 'wednesday', '18:30:00', 20,
 '00000000-0000-0000-0000-000000000002'),

('10000000-1000-1000-1000-100000000003', 'Young Professionals Fellowship', 
 'For working adults in their 20s and 30s. We focus on applying biblical principles to workplace challenges and building community.',
 'small-group', 'online', 'Zoom Meeting', 'thursday', '20:00:00', 12,
 '00000000-0000-0000-0000-000000000003'),

('10000000-1000-1000-1000-100000000004', 'College & Career Group', 
 'Dynamic group for college students and young adults. We study relevant topics and enjoy fellowship activities together.',
 'youth', 'in-person', 'Student Union Building', 'friday', '19:30:00', 25,
 '00000000-0000-0000-0000-000000000004'),

('10000000-1000-1000-1000-100000000005', 'Couples Growing Together', 
 'For married couples seeking to strengthen their relationship with God and each other through biblical principles.',
 'couples', 'in-person', 'The Davis Home', 'saturday', '18:00:00', 8,
 '00000000-0000-0000-0000-000000000005'),

('10000000-1000-1000-1000-100000000006', 'Women of Faith', 
 'Encouraging women in their walk with Christ through Bible study, prayer, and authentic fellowship.',
 'womens', 'hybrid', 'Grace Community Church', 'tuesday', '10:00:00', 18,
 '00000000-0000-0000-0000-000000000002'),

('10000000-1000-1000-1000-100000000007', 'Men''s Brotherhood', 
 'Men supporting men in spiritual growth, accountability, and service to the community.',
 'mens', 'in-person', 'Local Coffee Shop', 'saturday', '07:00:00', 10,
 '00000000-0000-0000-0000-000000000003');

-- ===============================================
-- 3. SAMPLE GROUP MEMBERS
-- ===============================================

INSERT INTO public.group_members (group_id, user_id, role, status, joined_at) VALUES

-- Downtown Bible Study members
('10000000-1000-1000-1000-100000000001', '00000000-0000-0000-0000-000000000001', 'leader', 'active', NOW() - INTERVAL '6 months'),
('10000000-1000-1000-1000-100000000001', '00000000-0000-0000-0000-000000000002', 'member', 'active', NOW() - INTERVAL '4 months'),
('10000000-1000-1000-1000-100000000001', '00000000-0000-0000-0000-000000000003', 'member', 'active', NOW() - INTERVAL '2 months'),

-- Prayer Warriors members
('10000000-1000-1000-1000-100000000002', '00000000-0000-0000-0000-000000000002', 'leader', 'active', NOW() - INTERVAL '1 year'),
('10000000-1000-1000-1000-100000000002', '00000000-0000-0000-0000-000000000001', 'co-leader', 'active', NOW() - INTERVAL '8 months'),
('10000000-1000-1000-1000-100000000002', '00000000-0000-0000-0000-000000000004', 'member', 'active', NOW() - INTERVAL '3 months'),
('10000000-1000-1000-1000-100000000002', '00000000-0000-0000-0000-000000000005', 'member', 'active', NOW() - INTERVAL '1 month'),

-- Young Professionals members
('10000000-1000-1000-1000-100000000003', '00000000-0000-0000-0000-000000000003', 'leader', 'active', NOW() - INTERVAL '8 months'),
('10000000-1000-1000-1000-100000000003', '00000000-0000-0000-0000-000000000004', 'member', 'active', NOW() - INTERVAL '5 months'),

-- College & Career members
('10000000-1000-1000-1000-100000000004', '00000000-0000-0000-0000-000000000004', 'leader', 'active', NOW() - INTERVAL '1 year'),
('10000000-1000-1000-1000-100000000004', '00000000-0000-0000-0000-000000000003', 'member', 'active', NOW() - INTERVAL '6 months'),

-- Couples Group members
('10000000-1000-1000-1000-100000000005', '00000000-0000-0000-0000-000000000005', 'leader', 'active', NOW() - INTERVAL '2 years'),
('10000000-1000-1000-1000-100000000005', '00000000-0000-0000-0000-000000000001', 'member', 'active', NOW() - INTERVAL '1 year'),

-- Women of Faith members
('10000000-1000-1000-1000-100000000006', '00000000-0000-0000-0000-000000000002', 'leader', 'active', NOW() - INTERVAL '3 years'),
('10000000-1000-1000-1000-100000000006', '00000000-0000-0000-0000-000000000004', 'member', 'active', NOW() - INTERVAL '1 year'),

-- Men's Brotherhood members
('10000000-1000-1000-1000-100000000007', '00000000-0000-0000-0000-000000000003', 'leader', 'active', NOW() - INTERVAL '1 year'),
('10000000-1000-1000-1000-100000000007', '00000000-0000-0000-0000-000000000001', 'member', 'active', NOW() - INTERVAL '8 months'),
('10000000-1000-1000-1000-100000000007', '00000000-0000-0000-0000-000000000005', 'member', 'active', NOW() - INTERVAL '6 months');

-- ===============================================
-- 4. SAMPLE PRAYER REQUESTS
-- ===============================================

INSERT INTO public.prayer_requests (id, user_id, group_id, title, description, category, priority, status, is_public, prayer_count) VALUES

('20000000-2000-2000-2000-200000000001', '00000000-0000-0000-0000-000000000002', NULL,
 'Healing for my mother', 'Please pray for my mother who is undergoing cancer treatment. We trust in God''s healing power.', 
 'healing', 'high', 'active', true, 15),

('20000000-2000-2000-2000-200000000002', '00000000-0000-0000-0000-000000000003', '10000000-1000-1000-1000-100000000003',
 'Job interview guidance', 'Have a important job interview next week. Praying for God''s will and wisdom.', 
 'guidance', 'normal', 'active', true, 8),

('20000000-2000-2000-2000-200000000003', '00000000-0000-0000-0000-000000000004', NULL,
 'Wisdom for college decisions', 'Choosing between different colleges and majors. Need God''s direction for my future.', 
 'guidance', 'normal', 'active', true, 12),

('20000000-2000-2000-2000-200000000004', '00000000-0000-0000-0000-000000000005', '10000000-1000-1000-1000-100000000005',
 'Marriage counseling success', 'We''re in Christian counseling and would appreciate prayers for our marriage restoration.', 
 'relationships', 'high', 'active', false, 6),

('20000000-2000-2000-2000-200000000005', '00000000-0000-0000-0000-000000000001', NULL,
 'Church building fund', 'Praise God! Our building fund reached its goal. Thank you for your faithful prayers!', 
 'praise', 'normal', 'answered', true, 25),

('20000000-2000-2000-2000-200000000006', '00000000-0000-0000-0000-000000000002', '10000000-1000-1000-1000-100000000002',
 'Safety for missionaries', 'Please pray for our mission team serving in difficult areas. Protection and fruitfulness.', 
 'travel', 'urgent', 'active', true, 20);

-- ===============================================
-- 5. SAMPLE PRAYER RESPONSES
-- ===============================================

INSERT INTO public.prayer_responses (prayer_request_id, user_id, encouragement_note) VALUES

('20000000-2000-2000-2000-200000000001', '00000000-0000-0000-0000-000000000001', 'Praying for complete healing and peace for your family. God is faithful!'),
('20000000-2000-2000-2000-200000000001', '00000000-0000-0000-0000-000000000003', 'Standing with you in prayer. Trusting in the Great Physician.'),
('20000000-2000-2000-2000-200000000001', '00000000-0000-0000-0000-000000000004', 'James 5:15 - "The prayer offered in faith will make the sick person well." Believing with you!'),

('20000000-2000-2000-2000-200000000002', '00000000-0000-0000-0000-000000000002', 'Praying for God''s perfect timing and opportunity. He has great plans for you!'),
('20000000-2000-2000-2000-200000000002', '00000000-0000-0000-0000-000000000004', 'Jeremiah 29:11 comes to mind. Praying for wisdom and open doors.'),

('20000000-2000-2000-2000-200000000003', '00000000-0000-0000-0000-000000000001', 'Such an important decision! Praying for clear direction and peace about God''s will.'),
('20000000-2000-2000-2000-200000000003', '00000000-0000-0000-0000-000000000002', 'Trust in the Lord with all your heart. He will direct your paths. Praying for you!');

-- ===============================================
-- 6. SAMPLE BIBLE STUDY SESSIONS
-- ===============================================

INSERT INTO public.bible_study_sessions (id, group_id, title, scripture_reference, study_notes, discussion_questions, session_date, session_number, leader_id) VALUES

('30000000-3000-3000-3000-300000000001', '10000000-1000-1000-1000-100000000001',
 'The Light of the World', 'John 8:12-20',
 'Jesus declares Himself to be the light of the world, offering spiritual illumination to all who follow Him. This passage reveals both His divinity and His mission to dispel spiritual darkness.',
 ARRAY['What does it mean that Jesus is "the light of the world"?', 'How does spiritual light differ from physical light?', 'What areas of your life need God''s light?'],
 CURRENT_DATE - INTERVAL '3 days', 15, '00000000-0000-0000-0000-000000000001'),

('30000000-3000-3000-3000-300000000002', '10000000-1000-1000-1000-100000000001',
 'The Good Shepherd', 'John 10:1-21',
 'Jesus uses the metaphor of a shepherd to describe His relationship with believers. Unlike thieves and hired hands, Jesus cares personally for His sheep.',
 ARRAY['What characteristics of a good shepherd does Jesus display?', 'How do we recognize the voice of our Shepherd?', 'What does it mean that Jesus laid down His life for the sheep?'],
 CURRENT_DATE + INTERVAL '4 days', 16, '00000000-0000-0000-0000-000000000001'),

('30000000-3000-3000-3000-300000000003', '10000000-1000-1000-1000-100000000004',
 'Faith in College Years', 'Daniel 1:8-21',
 'Daniel''s example of maintaining faith in a secular environment provides guidance for college students facing similar challenges.',
 ARRAY['How did Daniel maintain his convictions in Babylon?', 'What peer pressures do college students face today?', 'How can we be "10 times better" in our generation?'],
 CURRENT_DATE - INTERVAL '1 day', 8, '00000000-0000-0000-0000-000000000004');

-- ===============================================
-- 7. SAMPLE EVENTS
-- ===============================================

INSERT INTO public.events (id, group_id, title, description, event_type, start_date, end_date, location, max_attendees, registration_required, created_by) VALUES

('40000000-4000-4000-4000-400000000001', '10000000-1000-1000-1000-100000000001',
 'Community Bible Study Potluck', 'Join us for our monthly potluck dinner followed by group Bible study. Bring a dish to share and your appetite for God''s Word!',
 'fellowship', CURRENT_DATE + INTERVAL '10 days 18:00:00', CURRENT_DATE + INTERVAL '10 days 21:00:00',
 'Community Center Downtown', 50, true, '00000000-0000-0000-0000-000000000001'),

('40000000-4000-4000-4000-400000000002', '10000000-1000-1000-1000-100000000002',
 '24-Hour Prayer Vigil', 'Join us for continuous prayer for our community, city, and nation. Sign up for 1-hour slots.',
 'prayer', CURRENT_DATE + INTERVAL '14 days 18:00:00', CURRENT_DATE + INTERVAL '15 days 18:00:00',
 'First Baptist Church Prayer Room', 24, true, '00000000-0000-0000-0000-000000000002'),

('40000000-4000-4000-4000-400000000003', NULL,
 'Christian Fellowship Conference 2024', 'Annual conference featuring speakers on authentic biblical community, worship, and spiritual growth.',
 'conference', CURRENT_DATE + INTERVAL '30 days 09:00:00', CURRENT_DATE + INTERVAL '32 days 17:00:00',
 'Austin Convention Center', 500, true, '00000000-0000-0000-0000-000000000001'),

('40000000-4000-4000-4000-400000000004', '10000000-1000-1000-1000-100000000004',
 'College Ministry Game Night', 'Fun evening of games, fellowship, and devotion time. Pizza provided!',
 'social', CURRENT_DATE + INTERVAL '5 days 19:00:00', CURRENT_DATE + INTERVAL '5 days 22:00:00',
 'Student Union Building', 30, false, '00000000-0000-0000-0000-000000000004'),

('40000000-4000-4000-4000-400000000005', '10000000-1000-1000-1000-100000000007',
 'Men''s Hiking and Devotion', 'Early morning hike followed by coffee and Bible discussion. Great way to connect with God and brothers.',
 'outreach', CURRENT_DATE + INTERVAL '8 days 06:00:00', CURRENT_DATE + INTERVAL '8 days 10:00:00',
 'Zilker Park Trailhead', 15, true, '00000000-0000-0000-0000-000000000003');

-- ===============================================
-- 8. SAMPLE EVENT REGISTRATIONS
-- ===============================================

INSERT INTO public.event_registrations (event_id, user_id, status, notes) VALUES

('40000000-4000-4000-4000-400000000001', '00000000-0000-0000-0000-000000000002', 'registered', 'Bringing homemade lasagna to share!'),
('40000000-4000-4000-4000-400000000001', '00000000-0000-0000-0000-000000000003', 'registered', 'Looking forward to the fellowship time.'),
('40000000-4000-4000-4000-400000000001', '00000000-0000-0000-0000-000000000004', 'registered', 'First time attending - excited to meet everyone!'),

('40000000-4000-4000-4000-400000000002', '00000000-0000-0000-0000-000000000002', 'registered', 'Signed up for 2-3 AM slot'),
('40000000-4000-4000-4000-400000000002', '00000000-0000-0000-0000-000000000001', 'registered', 'Taking the midnight to 1 AM shift'),

('40000000-4000-4000-4000-400000000003', '00000000-0000-0000-0000-000000000001', 'registered', 'Attending all three days'),
('40000000-4000-4000-4000-400000000003', '00000000-0000-0000-0000-000000000002', 'registered', 'Really excited about the worship sessions'),
('40000000-4000-4000-4000-400000000003', '00000000-0000-0000-0000-000000000003', 'registered', 'Hope to network with other professionals'),

('40000000-4000-4000-4000-400000000004', '00000000-0000-0000-0000-000000000004', 'registered', 'Can help set up tables and chairs'),
('40000000-4000-4000-4000-400000000004', '00000000-0000-0000-0000-000000000003', 'registered', 'Bringing board games'),

('40000000-4000-4000-4000-400000000005', '00000000-0000-0000-0000-000000000003', 'registered', 'Need carpool - can meet at church'),
('40000000-4000-4000-4000-400000000005', '00000000-0000-0000-0000-000000000005', 'registered', 'Happy to drive others');

-- ===============================================
-- 9. SAMPLE TESTIMONIES
-- ===============================================

INSERT INTO public.testimonies (id, user_id, title, content, category, scripture_reference, is_approved, approved_by) VALUES

('50000000-5000-5000-5000-500000000001', '00000000-0000-0000-0000-000000000003',
 'God''s Provision in Job Search', 
 'After months of unemployment, I was getting discouraged. But God reminded me of His faithfulness through Philippians 4:19. Just when I thought all doors were closed, He opened an unexpected opportunity that was better than anything I had applied for. His timing is perfect!',
 'provision', 'Philippians 4:19', true, '00000000-0000-0000-0000-000000000001'),

('50000000-5000-5000-5000-500000000002', '00000000-0000-0000-0000-000000000002',
 'Healing Through Prayer', 
 'When my mother was diagnosed with cancer, our entire fellowship rallied in prayer. Through months of treatment, we saw God''s healing hand at work. Today she is cancer-free! The doctors called it remarkable, but we know it was the Great Physician.',
 'healing', 'James 5:15', true, '00000000-0000-0000-0000-000000000001'),

('50000000-5000-5000-5000-500000000003', '00000000-0000-0000-0000-000000000004',
 'Finding My Purpose in College', 
 'College was overwhelming until I found this fellowship group. Through Bible study and mentorship, God revealed His plan for my life. I''ve switched my major to social work because I want to serve others like Christ served us.',
 'spiritual_growth', 'Jeremiah 29:11', true, '00000000-0000-0000-0000-000000000001');

-- ===============================================
-- 10. SAMPLE RESOURCES
-- ===============================================

INSERT INTO public.resources (id, title, description, resource_type, category, author, scripture_references, difficulty_level, estimated_time_minutes, uploaded_by) VALUES

('60000000-6000-6000-6000-600000000001',
 'Small Group Leader Training Guide', 
 'Comprehensive guide for new small group leaders covering facilitation, pastoral care, and spiritual leadership principles.',
 'study-guide', 'leadership', 'Fellowship Leadership Team', 
 ARRAY['1 Timothy 3:1-7', 'Titus 1:5-9', 'Acts 20:28'], 'intermediate', 120,
 '00000000-0000-0000-0000-000000000001'),

('60000000-6000-6000-6000-600000000002',
 'Daily Prayer Journal Template', 
 'Structured template to help believers develop consistent prayer habits with Scripture meditation and reflection prompts.',
 'devotional', 'prayer', 'Prayer Ministry Team', 
 ARRAY['Matthew 6:5-15', '1 Thessalonians 5:17', 'Philippians 4:6-7'], 'beginner', 15,
 '00000000-0000-0000-0000-000000000002'),

('60000000-6000-6000-6000-600000000003',
 'Bible Study Methods for Beginners', 
 'Learn different approaches to personal Bible study including observation, interpretation, and application techniques.',
 'study-guide', 'bible-study', 'Teaching Ministry', 
 ARRAY['2 Timothy 3:16-17', 'Psalm 119:105', 'Acts 17:11'], 'beginner', 90,
 '00000000-0000-0000-0000-000000000001'),

('60000000-6000-6000-6000-600000000004',
 'Building Authentic Christian Fellowship', 
 'Article exploring what biblical fellowship looks like in practice and how to cultivate genuine community.',
 'article', 'discipleship', 'Pastor John Smith', 
 ARRAY['Acts 2:42-47', 'Hebrews 10:24-25', '1 John 1:7'], 'intermediate', 20,
 '00000000-0000-0000-0000-000000000001');

-- ===============================================
-- Update group member counts
-- ===============================================

UPDATE public.fellowship_groups SET current_members = (
    SELECT COUNT(*) FROM public.group_members 
    WHERE group_id = fellowship_groups.id AND status = 'active'
);

-- Update prayer counts
UPDATE public.prayer_requests SET prayer_count = (
    SELECT COUNT(*) FROM public.prayer_responses 
    WHERE prayer_request_id = prayer_requests.id
);

-- Update event attendee counts
UPDATE public.events SET current_attendees = (
    SELECT COUNT(*) FROM public.event_registrations 
    WHERE event_id = events.id AND status = 'registered'
);

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '🎉 Sample Data Inserted Successfully!';
    RAISE NOTICE '✅ 5 Sample Users (including 1 leader)';
    RAISE NOTICE '✅ 7 Fellowship Groups (various categories)';
    RAISE NOTICE '✅ 15 Group Memberships';
    RAISE NOTICE '✅ 6 Prayer Requests (with responses)';
    RAISE NOTICE '✅ 3 Bible Study Sessions';
    RAISE NOTICE '✅ 5 Events (with registrations)';
    RAISE NOTICE '✅ 3 Testimonies';
    RAISE NOTICE '✅ 4 Resources';
    RAISE NOTICE '🙏 Ready for Christian fellowship testing!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Note: Replace sample UUIDs with real auth.users IDs after user registration';
END $$;