// Supabase Configuration for Fellowship Website
// This file handles database connections and user management

const SUPABASE_CONFIG = {
    // Your Supabase project URL and credentials
    SUPABASE_URL: 'https://sugqrryqrvfckpkjzpd.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z3FycnlxcnZmY29rcGtqenBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjkxMDAsImV4cCI6MjA3MTEwNTEwMH0.BneMH8bLcNo7420qabcbz8qLPg0A83cU035eK8GRO_E',
    
    // Database table names
    TABLES: {
        USERS: 'users',
        FELLOWSHIP_GROUPS: 'fellowship_groups',
        GROUP_MEMBERS: 'group_members',
        PRAYER_REQUESTS: 'prayer_requests',
        BIBLE_STUDY_SESSIONS: 'bible_study_sessions',
        EVENTS: 'events',
        PRAYER_JOURNAL: 'prayer_journal',
        SPIRITUAL_GROWTH: 'spiritual_growth'
    },
    
    // API endpoints
    ENDPOINTS: {
        AUTH: '/auth/v1',
        REST: '/rest/v1',
        REALTIME: '/realtime/v1'
    }
};

// Supabase Client Class
class SupabaseClient {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.init();
    }

    // Initialize Supabase client
    async init() {
        try {
            // Check if Supabase is available
            if (typeof window !== 'undefined' && window.supabase) {
                this.supabase = window.supabase;
                this.isInitialized = true;
                console.log('Supabase client initialized successfully');
            } else {
                console.warn('Supabase client not available, using fallback methods');
                this.isInitialized = false;
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.isInitialized = false;
        }
    }

    // Get Supabase client
    getClient() {
        return this.supabase;
    }

    // Check if Supabase is available
    isAvailable() {
        return this.isInitialized && this.supabase !== null;
    }

    // User Authentication Methods
    async signUp(email, password, userData) {
        if (!this.isAvailable()) {
            return this.fallbackSignUp(email, password, userData);
        }

        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        if (!this.isAvailable()) {
            return this.fallbackSignIn(email, password);
        }

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        if (!this.isAvailable()) {
            return this.fallbackSignOut();
        }

        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Fellowship Groups Methods
    async createFellowshipGroup(groupData) {
        if (!this.isAvailable()) {
            return this.fallbackCreateGroup(groupData);
        }

        try {
            const { data, error } = await this.supabase
                .from(SUPABASE_CONFIG.TABLES.FELLOWSHIP_GROUPS)
                .insert([groupData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Create group error:', error);
            return { success: false, error: error.message };
        }
    }

    async getFellowshipGroups(filters = {}) {
        if (!this.isAvailable()) {
            return this.fallbackGetGroups(filters);
        }

        try {
            let query = this.supabase
                .from(SUPABASE_CONFIG.TABLES.FELLOWSHIP_GROUPS)
                .select('*');

            // Apply filters
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.location) {
                query = query.eq('location_type', filters.location);
            }
            if (filters.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Get groups error:', error);
            return { success: false, error: error.message };
        }
    }

    async joinFellowshipGroup(groupId, userId) {
        if (!this.isAvailable()) {
            return this.fallbackJoinGroup(groupId, userId);
        }

        try {
            const { data, error } = await this.supabase
                .from(SUPABASE_CONFIG.TABLES.GROUP_MEMBERS)
                .insert([{
                    group_id: groupId,
                    user_id: userId,
                    joined_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Join group error:', error);
            return { success: false, error: error.message };
        }
    }

    // Prayer Request Methods
    async createPrayerRequest(requestData) {
        if (!this.isAvailable()) {
            return this.fallbackCreatePrayer(requestData);
        }

        try {
            const { data, error } = await this.supabase
                .from(SUPABASE_CONFIG.TABLES.PRAYER_REQUESTS)
                .insert([requestData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Create prayer request error:', error);
            return { success: false, error: error.message };
        }
    }

    async getPrayerRequests(filters = {}) {
        if (!this.isAvailable()) {
            return this.fallbackGetPrayers(filters);
        }

        try {
            let query = this.supabase
                .from(SUPABASE_CONFIG.TABLES.PRAYER_REQUESTS)
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Get prayer requests error:', error);
            return { success: false, error: error.message };
        }
    }

    // Bible Study Methods
    async createBibleStudySession(sessionData) {
        if (!this.isAvailable()) {
            return this.fallbackCreateBibleStudy(sessionData);
        }

        try {
            const { data, error } = await this.supabase
                .from(SUPABASE_CONFIG.TABLES.BIBLE_STUDY_SESSIONS)
                .insert([sessionData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Create Bible study session error:', error);
            return { success: false, error: error.message };
        }
    }

    // Events Methods
    async createEvent(eventData) {
        if (!this.isAvailable()) {
            return this.fallbackCreateEvent(eventData);
        }

        try {
            const { data, error } = await this.supabase
                .from(SUPABASE_CONFIG.TABLES.EVENTS)
                .insert([eventData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Create event error:', error);
            return { success: false, error: error.message };
        }
    }

    async getEvents(filters = {}) {
        if (!this.isAvailable()) {
            return this.fallbackGetEvents(filters);
        }

        try {
            let query = this.supabase
                .from(SUPABASE_CONFIG.TABLES.EVENTS)
                .select('*')
                .gte('event_date', new Date().toISOString())
                .order('event_date', { ascending: true });

            if (filters.group_id) {
                query = query.eq('group_id', filters.group_id);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Get events error:', error);
            return { success: false, error: error.message };
        }
    }

    // Fallback Methods (when Supabase is not available)
    fallbackSignUp(email, password, userData) {
        // Store in localStorage as fallback
        const user = {
            id: Date.now().toString(),
            email: email,
            ...userData,
            created_at: new Date().toISOString()
        };
        
        localStorage.setItem('fellowship_user', JSON.stringify(user));
        return { success: true, data: user };
    }

    fallbackSignIn(email, password) {
        // Check localStorage for user
        const userStr = localStorage.getItem('fellowship_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.email === email) {
                return { success: true, data: user };
            }
        }
        return { success: false, error: 'Invalid credentials' };
    }

    fallbackSignOut() {
        localStorage.removeItem('fellowship_user');
        return { success: true };
    }

    fallbackCreateGroup(groupData) {
        const groups = JSON.parse(localStorage.getItem('fellowship_groups') || '[]');
        const newGroup = {
            id: Date.now().toString(),
            ...groupData,
            created_at: new Date().toISOString(),
            members: []
        };
        groups.push(newGroup);
        localStorage.setItem('fellowship_groups', JSON.stringify(groups));
        return { success: true, data: newGroup };
    }

    fallbackGetGroups(filters = {}) {
        const groups = JSON.parse(localStorage.getItem('fellowship_groups') || '[]');
        let filteredGroups = groups;

        if (filters.category) {
            filteredGroups = filteredGroups.filter(g => g.category === filters.category);
        }
        if (filters.location) {
            filteredGroups = filteredGroups.filter(g => g.location_type === filters.location);
        }
        if (filters.search) {
            filteredGroups = filteredGroups.filter(g => 
                g.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        return { success: true, data: filteredGroups };
    }

    fallbackJoinGroup(groupId, userId) {
        const groups = JSON.parse(localStorage.getItem('fellowship_groups') || '[]');
        const group = groups.find(g => g.id === groupId);
        if (group) {
            if (!group.members.includes(userId)) {
                group.members.push(userId);
                localStorage.setItem('fellowship_groups', JSON.stringify(groups));
            }
            return { success: true, data: group };
        }
        return { success: false, error: 'Group not found' };
    }

    fallbackCreatePrayer(requestData) {
        const prayers = JSON.parse(localStorage.getItem('prayer_requests') || '[]');
        const newPrayer = {
            id: Date.now().toString(),
            ...requestData,
            created_at: new Date().toISOString(),
            status: 'active'
        };
        prayers.push(newPrayer);
        localStorage.setItem('prayer_requests', JSON.stringify(prayers));
        return { success: true, data: newPrayer };
    }

    fallbackGetPrayers(filters = {}) {
        const prayers = JSON.parse(localStorage.getItem('prayer_requests') || '[]');
        let filteredPrayers = prayers;

        if (filters.category) {
            filteredPrayers = filteredPrayers.filter(p => p.category === filters.category);
        }
        if (filters.status) {
            filteredPrayers = filteredPrayers.filter(p => p.status === filters.status);
        }

        return { success: true, data: filteredPrayers };
    }

    fallbackCreateBibleStudy(sessionData) {
        const sessions = JSON.parse(localStorage.getItem('bible_study_sessions') || '[]');
        const newSession = {
            id: Date.now().toString(),
            ...sessionData,
            created_at: new Date().toISOString()
        };
        sessions.push(newSession);
        localStorage.setItem('bible_study_sessions', JSON.stringify(sessions));
        return { success: true, data: newSession };
    }

    fallbackCreateEvent(eventData) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const newEvent = {
            id: Date.now().toString(),
            ...eventData,
            created_at: new Date().toISOString()
        };
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        return { success: true, data: newEvent };
    }

    fallbackGetEvents(filters = {}) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        let filteredEvents = events.filter(e => new Date(e.event_date) >= new Date());

        if (filters.group_id) {
            filteredEvents = filteredEvents.filter(e => e.group_id === filters.group_id);
        }

        return { success: true, data: filteredEvents };
    }
}

// Initialize Supabase client
const supabaseClient = new SupabaseClient();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SupabaseClient, SUPABASE_CONFIG };
} else {
    // Browser environment
    window.SupabaseClient = SupabaseClient;
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.supabaseClient = supabaseClient;
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Supabase configuration loaded');
    console.log('Project URL:', SUPABASE_CONFIG.SUPABASE_URL);
    console.log('Client initialized:', supabaseClient.isAvailable());
});
