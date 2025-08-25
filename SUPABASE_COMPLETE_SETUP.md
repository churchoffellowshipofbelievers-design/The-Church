# 🗄️ Complete Supabase Database Setup Guide

## 🎯 **Step-by-Step Database Creation**

Follow these exact steps to create your complete Christian Fellowship database with all tables, security, and sample data.

## 🚀 **Step 1: Create Supabase Project**

1. **Go to Supabase**: [supabase.com](https://supabase.com)
2. **Sign up/Login** with your GitHub account (recommended)
3. **Create New Project**:
   - **Name**: `fellowship-of-believers`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (US East for better performance)
   - **Pricing Tier**: Free (perfect for getting started)

4. **Wait for setup** (takes 2-3 minutes)

## 🔑 **Step 2: Get Your Credentials**

1. **Go to Settings** → **API** in your Supabase dashboard
2. **Copy these values** (you'll need them):
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Public Key: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   Service Role Key: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... (keep this secret!)
   ```

## 🗃️ **Step 3: Create Database Structure**

### **Run the Main Database Setup**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Create a new query**
3. **Copy and paste** the entire contents of `supabase-database-setup.sql`
4. **Click Run** to execute

This creates:
- ✅ **12 database tables** with proper relationships
- ✅ **Performance indexes** for fast queries
- ✅ **Automatic triggers** for timestamp updates
- ✅ **Helper functions** and views

### **Expected Output:**
```
🎉 Christian Fellowship Database Setup Complete!
✅ Created 12 tables with proper relationships
✅ Added performance indexes
✅ Set up automatic timestamp triggers
🔐 Next: Run the RLS security policies script
```

## 🔐 **Step 4: Enable Security Policies**

### **Run the Security Setup**

1. **Create another new query** in SQL Editor
2. **Copy and paste** the entire contents of `supabase-security-policies.sql`
3. **Click Run** to execute

This configures:
- ✅ **Row Level Security (RLS)** on all tables
- ✅ **User permissions** for data access
- ✅ **Privacy protection** for personal data
- ✅ **Group-based access** control

### **Expected Output:**
```
🔐 Christian Fellowship Security Policies Complete!
✅ Enabled RLS on all 12 tables
✅ Created comprehensive security policies
✅ Added helper functions and views
🙏 Database is secure and ready for fellowship!
```

## 👥 **Step 5: Add Sample Data (Optional)**

### **Load Test Data**

1. **Create another new query** in SQL Editor
2. **Copy and paste** the entire contents of `supabase-sample-data.sql`
3. **Click Run** to execute

This adds:
- ✅ **5 sample users** (including 1 leader)
- ✅ **7 fellowship groups** (various types)
- ✅ **Sample prayer requests** and responses
- ✅ **Bible study sessions** and events
- ✅ **Testimonies and resources**

### **Expected Output:**
```
🎉 Sample Data Inserted Successfully!
✅ 5 Sample Users (including 1 leader)
✅ 7 Fellowship Groups (various categories)
✅ 6 Prayer Requests (with responses)
✅ 3 Bible Study Sessions
✅ 5 Events (with registrations)
🙏 Ready for Christian fellowship testing!
```

## 🔧 **Step 6: Configure Authentication**

### **Enable Email Authentication**

1. **Go to Authentication** → **Settings** in Supabase
2. **Enable Email authentication**
3. **Configure email templates** (optional):
   - Customize confirmation emails
   - Add your branding

### **Set Up Auth Policies**

The security policies already handle authentication, but you can:
- **Customize user registration** flow
- **Add email confirmation** requirements
- **Configure password requirements**

## 🌐 **Step 7: Connect to Your Website**

### **Update Environment Variables**

1. **Copy `.env.example` to `.env.local`**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Supabase credentials**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### **Test the Connection**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Check browser console** for:
   ```
   ✅ Supabase client initialized successfully
   ✅ Project URL: https://your-project.supabase.co
   ✅ Client initialized: true
   ```

## 📊 **Step 8: Verify Your Database**

### **Check Tables in Supabase Dashboard**

Go to **Table Editor** and verify these tables exist:

1. ✅ **users** - User profiles and information
2. ✅ **fellowship_groups** - Group management
3. ✅ **group_members** - Group membership tracking
4. ✅ **prayer_requests** - Community prayer wall
5. ✅ **prayer_responses** - Prayer support tracking
6. ✅ **bible_study_sessions** - Study materials
7. ✅ **events** - Event management
8. ✅ **event_registrations** - Event attendance
9. ✅ **prayer_journal** - Personal prayer tracking
10. ✅ **spiritual_growth** - Growth metrics
11. ✅ **testimonies** - Community testimonies
12. ✅ **resources** - Shared resources

### **Test Sample Data**

If you loaded sample data, check:
- **fellowship_groups** table has 7 groups
- **prayer_requests** table has 6 requests
- **events** table has 5 events
- All tables have proper relationships

## 🔄 **Step 9: Test Website Features**

### **Test User Registration**

1. **Go to your signup page**: `http://localhost:3000/signup.html`
2. **Register a new user**
3. **Check the users table** in Supabase for the new entry

### **Test Fellowship Features**

1. **Browse fellowship groups** on main page
2. **Submit a prayer request**
3. **Check database tables** for new entries

## 🚀 **Step 10: Deploy with GitHub Secrets**

### **Add Secrets to GitHub**

1. **Go to your GitHub repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add these Repository Secrets**:
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your_anon_key_here
   ```

### **Deploy to Production**

1. **Push any change** to trigger deployment:
   ```bash
   git add .
   git commit -m "Connect Supabase database"
   git push origin main
   ```

2. **Check GitHub Actions** for successful deployment
3. **Verify live site** has database functionality

## 📊 **Database Schema Overview**

### **Core Tables:**
- **users**: Extended user profiles
- **fellowship_groups**: Group management
- **group_members**: Membership relationships

### **Community Features:**
- **prayer_requests**: Community prayer wall
- **prayer_responses**: Prayer support
- **testimonies**: Shared testimonies

### **Activity Tracking:**
- **bible_study_sessions**: Study materials
- **events**: Event management
- **event_registrations**: Attendance tracking

### **Personal Growth:**
- **prayer_journal**: Private prayer tracking
- **spiritual_growth**: Personal metrics
- **resources**: Shared learning materials

## 🛡️ **Security Features**

### **Data Protection:**
- ✅ **Row Level Security** on all tables
- ✅ **User-based access** control
- ✅ **Group-based permissions**
- ✅ **Private data** protection

### **Privacy Controls:**
- ✅ **Anonymous prayer requests** option
- ✅ **Private prayer journal**
- ✅ **Controlled group membership**
- ✅ **Admin approval** for testimonies

## 📈 **Monitoring & Maintenance**

### **Supabase Dashboard**
- **Monitor database usage** and performance
- **Track API requests** and limits
- **View user authentication** activity
- **Check error logs** for issues

### **Regular Maintenance**
- **Review user activity** monthly
- **Clean up old events** and data
- **Monitor storage usage**
- **Update security policies** as needed

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"RLS policy violation"**
   - Check user authentication status
   - Verify policy logic matches user access

2. **"Table doesn't exist"**
   - Ensure all SQL scripts ran successfully
   - Check for typos in table names

3. **"Connection failed"**
   - Verify Supabase URL and API key
   - Check environment variable names

4. **"Permission denied"**
   - Review RLS policies
   - Test with different user roles

### **Getting Help:**
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Report bugs in our repository

## 🎉 **Success Checklist**

Before going live, verify:

- [ ] **Supabase project** created and configured
- [ ] **All 12 tables** exist with proper structure
- [ ] **RLS policies** enabled and working
- [ ] **Sample data** loaded (optional)
- [ ] **Authentication** configured
- [ ] **Environment variables** set correctly
- [ ] **Website connection** working locally
- [ ] **GitHub Secrets** configured
- [ ] **Production deployment** successful
- [ ] **Live website** database features working

## 🙏 **Your Fellowship Database is Ready!**

You now have a **enterprise-grade database** that supports:

- **User authentication** and profiles
- **Fellowship group management** with security
- **Community prayer support** system
- **Bible study** session tracking
- **Event coordination** with registration
- **Personal spiritual growth** tracking
- **Resource sharing** and testimonies
- **Privacy protection** and data security

Your Christian fellowship website is now ready to serve believers worldwide with a robust, scalable database backend! 🚀

*"And they devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer." - Acts 2:42*

---

**Need help?** Check our other guides:
- [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) - Production deployment
- [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) - Detailed configuration
- [README.md](./README.md) - Complete project overview