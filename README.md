# Fellowship of Believers

A Christian fellowship website based on the New Testament understanding of "church" as a community of believers rather than a building. This website creates digital spaces for believers to connect, study Scripture together, and build authentic relationships.

## 🎯 Mission

To provide a digital platform where believers can experience authentic fellowship, just as the early church did - building relationships, growing in faith, and encouraging one another in our walk with Christ.

## ✨ Features

- **Biblical Fellowship Groups**: Join virtual home groups, Bible studies, and discussion forums
- **Scripture Study Resources**: Daily verses, study materials, and biblical resources
- **Community Features**: Prayer wall, events, ministry opportunities, and testimonies
- **Responsive Design**: Beautiful, modern interface that works on all devices
- **Interactive Elements**: Smooth animations, form handling, and user engagement

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid, Flexbox, and CSS Variables
- **Icons**: Font Awesome 6
- **Fonts**: Inter (sans-serif) and Playfair Display (serif)
- **Bible API**: Scripture API integration for real Bible content
- **Web Scraping**: Firecrawl integration for live Christian resources
- **Deployment**: Vercel
- **Database**: Supabase (for future features)
- **Version Control**: Git/GitHub

## 📁 Project Structure

```
fellowship-of-believers/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── package.json        # Project dependencies and scripts
├── vercel.json         # Vercel deployment configuration
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Git
- GitHub account
- Supabase account
- Vercel account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fellowship-of-believers.git
cd fellowship-of-believers
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Local Development

```bash
npm run dev
```

This will start a local development server at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel`

2. **Automatic Deployment**:
   - Connect your GitHub repository to Vercel
   - Every push to main branch will trigger automatic deployment

### Environment Variables

Create a `.env` file for local development:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
BIBLE_API_KEY=your_bible_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

## 🔥 Firecrawl Integration

### Web Scraping & Content Aggregation

The website integrates with [Firecrawl](https://firecrawl.dev/) to provide live Christian study resources and content aggregation:

1. **Get Your API Key**:
   - Sign up at [firecrawl.dev](https://firecrawl.dev/)
   - Get your API key from the dashboard
   - Replace `'YOUR_FIRECRAWL_API_KEY'` in the configuration files

2. **Features**:
   - **Live Resource Loading**: Fetch real-time content from Christian websites
   - **Content Scraping**: Extract study materials, devotionals, and articles
   - **Smart Search**: Search across scraped content for specific topics
   - **Content Aggregation**: Combine resources from multiple Christian sites
   - **Rate Limiting**: Built-in rate limiting and error handling

3. **Supported Christian Websites**:
   - GotQuestions.org
   - BibleStudyTools.com
   - BlueLetterBible.org
   - BibleGateway.com
   - Crosswalk.com

4. **API Limits**:
   - **Free Tier**: 10 requests/minute, 100/hour, 1000/day
   - **Paid Tier**: 100 requests/minute, 1000/hour, 10000/day

### Web Scraping Features

- **Intelligent Scraping**: Extract main content, titles, and links
- **Content Processing**: Convert HTML to clean, readable text
- **Link Discovery**: Find related resources and articles
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Content Validation**: Ensure quality and relevance

## 📖 Bible API Integration

### Scripture API Setup

The website integrates with the [Scripture API](https://scripture.api.bible/) to provide real Bible content:

1. **Get Your API Key**:
   - Sign up at [scripture.api.bible](https://scripture.api.bible/)
   - Get your free API key from the dashboard
   - Replace `'YOUR_API_KEY_HERE'` in `script.js` with your actual key

2. **Features**:
   - **Daily Bible Verses**: Rotating daily verses with fallback content
   - **Bible Search**: Search Scripture by keywords, topics, or references
   - **Multiple Translations**: Support for ESV, NIV, KJV, NKJV, and more
   - **Interactive Study Resources**: Clickable study materials and devotionals

3. **API Limits (Free Tier)**:
   - 1000 requests per month
   - 10 requests per minute
   - 100 requests per hour

4. **Fallback Content**: If the API fails, the website displays curated fallback content to ensure users always see Bible verses.

### Bible Study Features

- **Scripture Search**: Real-time search through the Bible
- **Passage Display**: Clean, readable Bible passages
- **Copy & Share**: Easy sharing of Bible verses
- **Study Resources**: Interactive overviews and devotionals
- **Multiple Bible Versions**: Choose your preferred translation

## 🗄️ Supabase Integration

### Database Schema (Future Implementation)

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fellowship groups
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members
CREATE TABLE group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Prayer requests
CREATE TABLE prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add environment variables to Vercel
4. Run the SQL schema above in your Supabase SQL editor

## 🔧 Customization

### Colors

The website uses CSS custom properties for easy color customization:

```css
:root {
  --primary-color: #2c5aa0;      /* Main blue */
  --secondary-color: #f8b500;    /* Gold accent */
  --accent-color: #e74c3c;       /* Red accent */
  --text-dark: #2c3e50;          /* Dark text */
  --text-light: #7f8c8d;         /* Light text */
}
```

### Content

- Update Bible verses in `index.html`
- Modify fellowship group descriptions
- Add new community features
- Customize contact information

## 📱 Responsive Design

The website is fully responsive and includes:

- Mobile-first approach
- CSS Grid and Flexbox layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Biblical inspiration from the New Testament understanding of church as fellowship
- Design inspiration from modern web development best practices
- Community-focused approach based on Acts 2:42

## 📞 Support

For questions or support:
- Email: hello@fellowshipofbelievers.org
- Create an issue on GitHub
- Contact through the website form

---

**"For where two or three gather in my name, there am I with them."** - Matthew 18:20
