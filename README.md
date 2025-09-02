# The Church - Fellowship of the Believers

A comprehensive digital platform that educates and connects believers around authentic New Testament church fellowship principles, emphasizing the priesthood of all believers, participatory worship, and decentralized, servant-led community.

## 🎯 Mission

To restore biblical understanding of Christian fellowship as demonstrated in the New Testament, where believers gather as equals before God, without hierarchical control or human priests, fostering genuine community based on apostolic teachings.

## ✨ Features

### 🔐 Authentication System
- **Multi-step registration** with email verification
- **Profile completion** with Christian testimony requirement
- **Community guidelines** acceptance
- **Protected routes** - all content requires login
- **Social authentication** (Google OAuth)

### 👥 Fellowship Features
- **Live Fellowship Chat** - Real-time scheduled meetings
- **Event Management** - Create and join fellowship events
- **Prayer Request System** - Community prayer support
- **Discussion Forums** - Biblical topic discussions
- **Study Groups** - Private/public group formation

### 📖 Bible Integration
- **Multi-translation Bible search**
- **Cross-references** and study tools
- **Audio Bible** support
- **Scripture sharing** in fellowship

### 📚 Educational Content
- **Biblical fellowship principles** articles
- **Historical context** materials
- **Practical application** guides
- **Downloadable resources**

### 🎨 Design & UX
- **Biblical design** reflecting New Testament simplicity
- **Mobile-responsive** Progressive Web App
- **Dark mode** support
- **Accessibility** compliant (WCAG 2.1 AA)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)

### 1. Clone and Install
```bash
git clone <repository-url>
cd the-church
npm install
```

### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema:
   ```bash
   # Copy the contents of supabase-schema.sql
   # Paste into Supabase SQL Editor and run
   ```
3. Get your project URL and anon key from Settings > API

### 3. Environment Configuration
Create `.env.local`:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME="The Church - Fellowship of the Believers"

# Optional: Bible APIs (Free tiers)
ESV_API_KEY=your-esv-api-key
BIBLE_GATEWAY_API_KEY=your-bible-gateway-key

# Optional: FireCrawl API
FIRECRAWL_API_KEY=your-firecrawl-api-key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

## 📋 Implementation Status

### ✅ Completed
- [x] **Authentication System** - Login/register with Supabase
- [x] **Protected Routes** - Middleware-based access control
- [x] **User Profiles** - Multi-step registration flow
- [x] **Fellowship Dashboard** - Main authenticated interface
- [x] **Database Schema** - Complete Supabase setup
- [x] **UI Components** - Responsive design system
- [x] **Navigation** - Smooth scrolling and routing

### 🚧 In Progress
- [ ] **Live Chat** - Real-time fellowship meetings
- [ ] **Event Management** - Create/join fellowship events
- [ ] **Prayer Requests** - Community prayer system
- [ ] **Bible Integration** - Multi-API Bible search
- [ ] **Discussion Forums** - Threaded conversations
- [ ] **Content Management** - Educational articles

### 📅 Planned
- [ ] **Study Groups** - Private/public group formation
- [ ] **Audio Bible** - Multi-language support
- [ ] **Mobile App** - React Native implementation
- [ ] **Analytics** - Community engagement metrics
- [ ] **Moderation Tools** - Content and user management

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase SSR** for authentication

### Backend
- **Supabase** (PostgreSQL, Auth, Real-time)
- **Row Level Security** for data protection
- **Real-time subscriptions** for live features

### Integrations
- **Bible APIs** - ESV, Bible Gateway, YouVersion
- **FireCrawl** - Content enhancement
- **Vercel** - Hosting and deployment

## 🔒 Security Features

- **Row Level Security** (RLS) on all tables
- **JWT token validation** with secure storage
- **Email verification** required
- **Rate limiting** and API protection
- **Content moderation** system
- **GDPR/CCPA** compliant data handling

## 📱 User Flow

1. **Landing Page** → Learn about biblical fellowship
2. **Registration** → Multi-step account creation
3. **Email Verification** → Confirm identity
4. **Profile Completion** → Share testimony
5. **Guidelines Acceptance** → Agree to community standards
6. **Fellowship Dashboard** → Access all features

## 🎨 Design Principles

### Biblical Foundation
- **Simplicity** reflecting New Testament patterns
- **Equality** emphasizing priesthood of all believers
- **Community** fostering authentic relationships
- **Service** highlighting servant leadership

### Technical Excellence
- **Performance** - <2 second page loads
- **Accessibility** - WCAG 2.1 AA compliance
- **Mobile-first** - Progressive Web App
- **SEO optimized** - Server-side rendering

## 📊 Success Metrics

### Quantitative
- **1,000+** monthly unique visitors by month 6
- **5+ minutes** average session duration
- **100+** registered members by month 12
- **500+** monthly resource downloads

### Qualitative
- **80%+** positive user feedback
- **Biblical accuracy** verification
- **Active community** discussions
- **Mission alignment** maintained

## 🤝 Contributing

We welcome contributions from believers committed to biblical fellowship principles. Please read our contributing guidelines and ensure all content aligns with New Testament teachings.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Biblical Foundation

This platform is built on the following New Testament principles:

- **Acts 2:42-47** - Early church fellowship
- **1 Peter 2:9** - Royal priesthood of all believers
- **1 Corinthians 14:26** - Participatory worship
- **1 Timothy 2:5** - One mediator between God and man
- **1 Peter 5:1-4** - Servant leadership

---

**"For where two or three gather in my name, there am I with them."** - Matthew 18:20
