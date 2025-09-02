# 🗄️ Supabase Database Setup Guide for Fellowship Website

This guide will help you set up Supabase database integration for the Christian Fellowship Website, including GitHub deployment configuration.

## 🎯 **Overview**

Supabase provides the backend database for:
- **User authentication** and profiles
- **Fellowship group management**
- **Prayer request storage**
- **Bible study session tracking**
- **Event coordination**
- **Community engagement data**

## 🚀 **Quick Setup**

### **1. Create Supabase Project**

1. **Go to Supabase**: [supabase.com](https://supabase.com)
2. **Sign up/Login** with your GitHub account
3. **Create New Project**:
   - **Name**: `fellowship-of-believers` or similar
   - **Database Password**: Generate a secure password
   - **Region**: Choose closest to your users
   - **Pricing**: Free tier (up to 50MB database, 2 projects)

### **2. Get Your Credentials**

After project creation:
1. Go to **Settings** → **API**
2. **Copy these values**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJ0eXAi...` (safe for frontend)
   - **Service Role Key**: `eyJ0eXAi...` (keep secret - admin access)

### **3. Configure Environment Variables**

1. **Copy the template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Supabase credentials**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```

## 🗃️ **Database Schema Setup**

### **Required Tables**

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    fellowship_interests TEXT[],
    location TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fellowship Groups table
CREATE TABLE public.fellowship_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'bible-study', 'prayer', 'youth', etc.
    location_type TEXT NOT NULL, -- 'online', 'in-person', 'hybrid'
    location TEXT,
    meeting_time TEXT,
    max_members INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members table
CREATE TABLE public.group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.fellowship_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'leader', 'co-leader', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Prayer Requests table
CREATE TABLE public.prayer_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- 'healing', 'family', 'guidance', etc.
    status TEXT DEFAULT 'active', -- 'active', 'answered', 'closed'
    is_anonymous BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bible Study Sessions table
CREATE TABLE public.bible_study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.fellowship_groups(id),
    title TEXT NOT NULL,
    scripture_reference TEXT,
    study_notes TEXT,
    discussion_questions TEXT[],
    session_date DATE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.fellowship_groups(id),
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT, -- 'meeting', 'study', 'prayer', 'social', etc.
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    max_attendees INTEGER,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer Journal table (personal prayer tracking)
CREATE TABLE public.prayer_journal (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    prayer_text TEXT NOT NULL,
    category TEXT,
    is_answered BOOLEAN DEFAULT false,
    answered_date DATE,
    answered_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spiritual Growth Tracking table
CREATE TABLE public.spiritual_growth (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    metric_type TEXT NOT NULL, -- 'bible_reading', 'prayer_time', 'fellowship_attendance'
    metric_value INTEGER,
    metric_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, metric_type, metric_date)
);
```

### **Row Level Security (RLS)**

Enable RLS for data protection:

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fellowship_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_growth ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can manage own profile" ON public.users
    FOR ALL USING (auth.uid() = id);

-- Fellowship groups are readable by all, manageable by creators
CREATE POLICY "Fellowship groups are publicly readable" ON public.fellowship_groups
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create fellowship groups" ON public.fellowship_groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own fellowship groups" ON public.fellowship_groups
    FOR UPDATE USING (auth.uid() = created_by);

-- Group members can see other members in same group
CREATE POLICY "Group members can see group membership" ON public.group_members
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.group_members WHERE group_id = group_members.group_id
        )
    );

-- Prayer requests - public or own
CREATE POLICY "Prayer requests are publicly readable or own" ON public.prayer_requests
    FOR SELECT USING (is_anonymous = false OR auth.uid() = user_id);

CREATE POLICY "Users can create prayer requests" ON public.prayer_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer requests" ON public.prayer_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- Prayer journal is private to user
CREATE POLICY "Users can manage own prayer journal" ON public.prayer_journal
    FOR ALL USING (auth.uid() = user_id);

-- Spiritual growth is private to user
CREATE POLICY "Users can manage own spiritual growth" ON public.spiritual_growth
    FOR ALL USING (auth.uid() = user_id);
```

## 🔐 **GitHub Integration Setup**

### **1. Environment Variables for Development**

1. **Copy template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Never commit .env.local** - it's already in .gitignore

### **2. GitHub Secrets for Production**

For production deployment, add these secrets to your GitHub repository:

1. **Go to your GitHub repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add these Repository Secrets**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   BIBLE_API_KEY=your_scripture_api_key
   FIRECRAWL_API_KEY=your_firecrawl_key
   ```

### **3. Multiple Environment Setup**

**Recommended approach**:
- **Development**: Local Supabase project
- **Production**: Separate Supabase project

**Benefits**:
- Test changes safely
- Separate user data
- Different API quotas

## 📊 **Database Management**

### **Supabase Dashboard Features**

1. **Table Editor**: View and edit data directly
2. **SQL Editor**: Run custom queries
3. **Authentication**: Manage user accounts
4. **Storage**: File uploads (if needed later)
5. **Edge Functions**: Serverless functions
6. **Logs**: Monitor database activity

### **Backup Strategy**

1. **Automatic Backups**: Supabase handles this
2. **Manual Export**: Use Supabase dashboard
3. **Migration Scripts**: Keep schema changes in version control

## 🚀 **Deployment Configuration**

### **Vercel Integration**

When connecting to Vercel:

1. **Connect GitHub repository** to Vercel
2. **Add Environment Variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `BIBLE_API_KEY`
   - `FIRECRAWL_API_KEY`

### **Other Hosting Platforms**

For other platforms, ensure you set these environment variables:
- Netlify: Site settings → Environment variables
- Firebase: `.env` files and Firebase config
- AWS Amplify: App settings → Environment variables

## 🔍 **Testing Database Connection**

### **Test Locally**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Open browser console** and check for:
   ```
   Supabase client initialized successfully
   Project URL: https://your-project.supabase.co
   Client initialized: true
   ```

3. **Test user registration** on signup page

### **Verify Data**

1. **Go to Supabase dashboard**
2. **Table Editor** → **Users table**
3. **Check if test registrations appear**

## 🛡️ **Security Best Practices**

### **API Keys**
- ✅ **Use ANON key** for frontend (safe to expose)
- ❌ **Never expose SERVICE ROLE key** in frontend
- 🔄 **Rotate keys** regularly
- 📝 **Monitor usage** in Supabase dashboard

### **Row Level Security**
- ✅ **Enable RLS** on all tables
- 🔒 **Test policies** with different user accounts
- 📊 **Monitor access patterns**

### **Environment Variables**
- ✅ **Use different projects** for dev/production
- ❌ **Never commit real credentials**
- 🔐 **Use GitHub Secrets** for deployment
- 📝 **Document required variables**

## 📈 **Monitoring & Analytics**

### **Supabase Dashboard**

Monitor:
- **Database usage** and limits
- **API requests** per day/month
- **Active users** and sessions
- **Query performance**

### **Application Metrics**

Track:
- User registrations
- Fellowship group creation
- Prayer request activity
- Bible study engagement

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Connection Failed**:
   - Check URL and API key
   - Verify environment variables
   - Check network connectivity

2. **RLS Policy Errors**:
   - Review policy logic
   - Test with different users
   - Check auth state

3. **Deployment Issues**:
   - Verify GitHub Secrets
   - Check build logs
   - Confirm environment variable names

### **Getting Help**

- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Report bugs in our repository

## 🙏 **Next Steps**

1. **Set up your Supabase project**
2. **Configure environment variables**
3. **Run database schema setup**
4. **Test locally**
5. **Configure deployment secrets**
6. **Deploy to production**

Your Christian Fellowship Website will now have a robust, scalable database backend that grows with your community! 🚀

---

*"And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another." - Hebrews 10:24-25*