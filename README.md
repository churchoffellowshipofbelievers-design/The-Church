<<<<<<< HEAD
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
=======
# 🕊️ Fellowship of Believers

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://churchoffellowshipofbelievers-design.github.io/The-Church/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?style=for-the-badge&logo=github)](https://github.com/churchoffellowshipofbelievers-design/The-Church)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)
[![HTML5](https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> *"For where two or three gather in my name, there am I with them."* - Matthew 18:20

A **Christian fellowship website** based on the New Testament understanding of "church" as a **community of believers** rather than a building. This platform creates digital spaces for believers to connect, study Scripture together, and build authentic relationships - just as the early church did.

## 🌟 What Makes This Special

### ✝️ **Biblical Foundation**
- **Not a church building** - focuses on authentic fellowship
- **Community-driven** rather than clergy-led
- **Relationship-focused** rather than program-focused
- **Scripture-based** foundation for all features

### 🚀 **Rich Features**
- **10+ Free Christian APIs** providing real-time content
- **Interactive Bible Study** with trivia and search
- **Community Prayer Wall** with request sharing
- **Personal Spiritual Dashboard** with growth tracking
- **Small Group Management** for local fellowship

## 📱 **Live Demo**

🔗 **Visit the website**: [Fellowship of Believers](https://churchoffellowshipofbelievers-design.github.io/The-Church/)

## ✨ **Key Features**

### 🏠 **Fellowship & Community**
- **Small Group Management** with search and filtering
- **Featured Fellowship Groups** (Bible Study, Prayer, Youth, etc.)
- **Community Discussion Forums** for meaningful conversations
- **Event Coordination** for local gatherings
- **Member Profiles** and connections

### 📖 **Biblical Study Tools**
- **Daily Bible Verses** with multiple translations
- **Interactive Bible Trivia** with categories (Gospels, Acts, Pauline Epistles)
- **Scripture Search** with passage display and sharing
- **Bible Study Resources** and materials
- **Christian Calendar** with holidays and events

### 🙏 **Prayer & Support**
- **Community Prayer Wall** with request submission
- **Prayer Request Categories** and filtering
- **Personal Prayer Journal** integration
- **Prayer Statistics** and community engagement
- **Intercession Support** networks

### 📊 **Personal Growth**
- **Spiritual Dashboard** with progress tracking
- **Bible Reading Metrics** (days, verses, chapters)
- **Prayer Request Management** (active, answered)
- **Fellowship Group Participation** tracking
- **Growth Analytics** and insights

### 🌐 **Rich Content Integration**
- **Multiple Bible APIs** (Scripture API, Bible Gateway, OpenBible)
- **Daily Christian Quotes** from inspirational leaders
- **Latest Christian News** from trusted RSS sources
- **Christian Resource Scraping** with Firecrawl
- **Real-time Content Updates** with caching

## 🛠️ **Tech Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with Grid, Flexbox, and CSS Variables
- **APIs**: 10+ Free Christian APIs integrated
- **Database**: Supabase with localStorage fallback
- **Deployment**: Vercel-ready configuration
- **Features**: Mobile-first responsive design, accessibility compliance

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v14 or higher)
- Git
- Modern web browser

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/churchoffellowshipofbelievers-design/The-Church.git
cd The-Church
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
>>>>>>> 41b78f42a4492721aae751d5419b5c0364fcf414
```bash
npm run dev
```

<<<<<<< HEAD
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
=======
4. **Open in browser**
```
http://localhost:3000
```

### **API Setup (Optional)**

Get your free API keys to unlock all features:

1. **Bible API**: [scripture.api.bible](https://scripture.api.bible) - 1000 requests/month free
2. **Firecrawl API**: [firecrawl.dev](https://firecrawl.dev) - Web scraping for Christian resources
3. **Supabase**: [supabase.com](https://supabase.com) - Database for user management

See [FREE_API_SETUP_GUIDE.md](./FREE_API_SETUP_GUIDE.md) for detailed instructions.

## 📁 **Project Structure**

```
The-Church/
├── 📄 index.html              # Main fellowship website
├── 📄 signup.html             # User registration system
├── 🎨 styles.css              # Responsive CSS styling
├── ⚡ script.js               # Core JavaScript functionality
├── 🔌 christian-apis-integration.js  # 10+ Christian APIs
├── 🔌 bible-api-config.js     # Bible API configuration
├── 🔌 firecrawl-config.js     # Web scraping setup
├── 🔌 supabase-config.js      # Database configuration
├── 📦 package.json            # Dependencies and scripts
├── 🚀 vercel.json             # Deployment configuration
├── 📚 Documentation/          # Comprehensive guides
│   ├── FELLOWSHIP_WEBSITE_GUIDE.md
│   ├── FREE_API_SETUP_GUIDE.md
│   ├── CHRISTIAN_FELLOWSHIP_RESEARCH.md
│   └── GITHUB_SETUP_GUIDE.md
└── 🚫 .gitignore              # Git ignore rules
```

## 🌟 **What This Website IS and ISN'T**

### ✅ **What This IS:**
- **Digital fellowship platform** for authentic Christian community
- **Tools for small groups** and local gatherings
- **Resource hub** for Bible study and spiritual growth
- **Prayer support network** for believers
- **Enhancement** to local Christian community

### ❌ **What This ISN'T:**
- **Not a church building** or physical location
- **Not a religious institution** with hierarchy
- **Not a replacement** for local fellowship
- **Not denominationally affiliated** with any specific church

Read the complete guide: [FELLOWSHIP_WEBSITE_GUIDE.md](./FELLOWSHIP_WEBSITE_GUIDE.md)

## 🤝 **Contributing**

We welcome contributions from the Christian community! Here's how you can help:

### **Ways to Contribute**
- 🐛 **Report bugs** and suggest improvements
- ✨ **Suggest new features** for community building
- 📖 **Improve documentation** and guides
- 🔧 **Submit code improvements** and bug fixes
- 🙏 **Share feedback** from your fellowship groups

### **Getting Started**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing fellowship feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📋 **Issues & Feature Requests**

- 🐛 **Found a bug?** [Report it here](https://github.com/churchoffellowshipofbelievers-design/The-Church/issues)
- 💡 **Have a feature idea?** [Suggest it here](https://github.com/churchoffellowshipofbelievers-design/The-Church/issues)
- ❓ **Need help?** [Ask in Discussions](https://github.com/churchoffellowshipofbelievers-design/The-Church/discussions)

## 💬 **Community**

Join our community discussions:

- 💬 **General Discussion**: Community feedback and ideas
- 🙏 **Prayer Requests**: Share prayer needs with developers
- 📖 **Bible Study**: Discuss Scripture and spiritual growth
- 💡 **Feature Requests**: Suggest new fellowship tools
- 🐛 **Bug Reports**: Help improve the platform

[Join the Discussion →](https://github.com/churchoffellowshipofbelievers-design/The-Church/discussions)

## 🚀 **Deployment**

### **GitHub Pages (Automatic)**
This repository is automatically deployed to GitHub Pages:
- **Live URL**: https://churchoffellowshipofbelievers-design.github.io/The-Church/
- **Updates**: Automatic deployment on every push to main branch

### **Vercel (Alternative)**
Ready for one-click deployment to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/churchoffellowshipofbelievers-design/The-Church)

### **Other Platforms**
Works on any static hosting service:
- Netlify
- Firebase Hosting
- AWS S3
- Any web server

## 📊 **Project Stats**

- 📁 **20+ Files** including comprehensive documentation
- 🔌 **10+ APIs** integrated for rich Christian content
- 📱 **100% Responsive** design for all devices
- ♿ **Accessibility** compliant (WCAG guidelines)
- ⚡ **Fast Loading** with intelligent caching
- 🔒 **Secure** with proper API key handling

## 🙏 **Biblical Foundation**

This project is built on New Testament principles:

> *"And they devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer. And the Lord added to their number daily those who were being saved."* - **Acts 2:42, 47**

Our goal is to create digital tools that support the same authentic fellowship that characterized the early church - believers gathering in authentic relationship, not institutional structures.

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

**Why MIT License?** We want this Christian fellowship platform to be freely available to believers and Christian communities worldwide, with no restrictions on use, modification, or distribution.

## 🤝 **Support**

### **Documentation**
- 📚 **Complete Setup Guide**: [FREE_API_SETUP_GUIDE.md](./FREE_API_SETUP_GUIDE.md)
- 🏛️ **GitHub Integration**: [GITHUB_SETUP_GUIDE.md](./GITHUB_SETUP_GUIDE.md)
- 🔬 **Research & Best Practices**: [CHRISTIAN_FELLOWSHIP_RESEARCH.md](./CHRISTIAN_FELLOWSHIP_RESEARCH.md)

### **Get Help**
- 💬 **Community Discussions**: [GitHub Discussions](https://github.com/churchoffellowshipofbelievers-design/The-Church/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/churchoffellowshipofbelievers-design/The-Church/issues)
- 📧 **Email Support**: contact@fellowshipofbelievers.org

## 🌟 **Star This Repository**

If this project blesses you or your community, please ⭐ **star this repository** to help other believers discover it!

## 🎯 **Mission Statement**

*"To create digital spaces where believers can experience authentic Christian fellowship - building relationships, growing in faith, and encouraging one another in our walk with Christ, just as the early church did."*

---

**Made with ❤️ for the global Christian community**

*This website serves the biblical understanding of fellowship as a community of believers gathered in authentic relationship, not as an institutional church structure.*
>>>>>>> 41b78f42a4492721aae751d5419b5c0364fcf414
