// Christian APIs Integration
// Combines multiple free Christian APIs to provide rich content for our fellowship website

// API Configuration
const CHRISTIAN_APIS_CONFIG = {
    // Bible APIs
    BIBLE: {
        SCRIPTURE_API: {
            baseUrl: 'https://api.scripture.api.bible/v1',
            apiKey: 'YOUR_SCRIPTURE_API_KEY', // Replace with your key
            rateLimit: 1000 // requests per month
        },
        BIBLE_GATEWAY: {
            baseUrl: 'https://www.biblegateway.com/api',
            apiKey: 'YOUR_BIBLE_GATEWAY_KEY', // Replace with your key
            rateLimit: 1000 // requests per month
        },
        BIBLE_ORG: {
            baseUrl: 'https://api.bible.org/v2',
            apiKey: 'YOUR_BIBLE_ORG_KEY', // Replace with your key
            rateLimit: 1000 // requests per month
        },
        OPEN_BIBLE: {
            baseUrl: 'https://labs.bible.org/api',
            rateLimit: 1000 // requests per month
        }
    },
    
    // Content APIs
    CONTENT: {
        CHRISTIAN_QUOTES: {
            baseUrl: 'https://api.quotable.io',
            rateLimit: 1000 // requests per month
        },
        HYMNARY: {
            baseUrl: 'https://api.hymnary.org',
            rateLimit: 500 // requests per month
        }
    },
    
    // News & Media APIs
    NEWS: {
        CHRISTIAN_POST: {
            rssUrl: 'https://www.christianpost.com/rss.xml',
            rateLimit: 'unlimited'
        },
        CROSSWALK: {
            rssUrl: 'https://www.crosswalk.com/rss.xml',
            rateLimit: 'unlimited'
        },
        GOT_QUESTIONS: {
            rssUrl: 'https://www.gotquestions.org/rss.xml',
            rateLimit: 'unlimited'
        }
    },
    
    // Calendar APIs
    CALENDAR: {
        CHRISTIAN_CALENDAR: {
            baseUrl: 'https://api.christiancalendar.org',
            rateLimit: 1000 // requests per month
        },
        BIBLE_READING_PLANS: {
            baseUrl: 'https://api.biblereadingplans.com',
            rateLimit: 1000 // requests per month
        }
    }
};

// API Rate Limiting and Caching
class APIManager {
    constructor() {
        this.cache = new Map();
        this.requestCounts = new Map();
        this.lastRequestTimes = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    // Check rate limits
    checkRateLimit(apiName) {
        const now = Date.now();
        const lastRequest = this.lastRequestTimes.get(apiName) || 0;
        const requestCount = this.requestCounts.get(apiName) || 0;
        
        // Basic rate limiting - 1 request per second minimum
        if (now - lastRequest < 1000) {
            return false;
        }
        
        this.lastRequestTimes.set(apiName, now);
        this.requestCounts.set(apiName, requestCount + 1);
        return true;
    }

    // Get cached data or fetch from API
    async getCachedOrFetch(apiName, fetchFunction) {
        const cacheKey = `${apiName}_${Date.now()}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        
        try {
            const data = await fetchFunction();
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            return data;
        } catch (error) {
            console.error(`API Error for ${apiName}:`, error);
            // Return cached data if available, even if expired
            if (cached) {
                return cached.data;
            }
            throw error;
        }
    }
}

// Bible API Integration
class BibleAPI {
    constructor(apiManager) {
        this.apiManager = apiManager;
    }

    // Get verse from multiple Bible APIs
    async getVerse(reference, translation = 'ESV') {
        return this.apiManager.getCachedOrFetch('bible_verse', async () => {
            try {
                // Try Scripture API first
                const scriptureResponse = await this.getScriptureVerse(reference, translation);
                if (scriptureResponse) return scriptureResponse;
                
                // Fallback to Bible.org
                const bibleOrgResponse = await this.getBibleOrgVerse(reference, translation);
                if (bibleOrgResponse) return bibleOrgResponse;
                
                // Final fallback to OpenBible
                return await this.getOpenBibleVerse(reference);
            } catch (error) {
                console.error('All Bible APIs failed:', error);
                return this.getFallbackVerse(reference);
            }
        });
    }

    // Scripture API
    async getScriptureVerse(reference, translation) {
        if (!CHRISTIAN_APIS_CONFIG.BIBLE.SCRIPTURE_API.apiKey || 
            CHRISTIAN_APIS_CONFIG.BIBLE.SCRIPTURE_API.apiKey === 'YOUR_SCRIPTURE_API_KEY') {
            return null;
        }

        try {
            const response = await fetch(
                `${CHRISTIAN_APIS_CONFIG.BIBLE.SCRIPTURE_API.baseUrl}/bibles/${translation}/search?query=${encodeURIComponent(reference)}`,
                {
                    headers: {
                        'api-key': CHRISTIAN_APIS_CONFIG.BIBLE.SCRIPTURE_API.apiKey
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.data.passages[0];
            }
        } catch (error) {
            console.error('Scripture API failed:', error);
        }
        return null;
    }

    // Bible.org API
    async getBibleOrgVerse(reference, translation) {
        try {
            const response = await fetch(
                `${CHRISTIAN_APIS_CONFIG.BIBLE.BIBLE_ORG.baseUrl}/passages.js?formatting=plain&q=${encodeURIComponent(reference)}`
            );
            
            if (response.ok) {
                const data = await response.json();
                return {
                    content: data.response.passages[0].text,
                    reference: reference,
                    translation: translation
                };
            }
        } catch (error) {
            console.error('Bible.org API failed:', error);
        }
        return null;
    }

    // OpenBible API
    async getOpenBibleVerse(reference) {
        try {
            const response = await fetch(
                `${CHRISTIAN_APIS_CONFIG.BIBLE.OPEN_BIBLE.baseUrl}/?passage=${encodeURIComponent(reference)}&formatting=plain`
            );
            
            if (response.ok) {
                const data = await response.json();
                return {
                    content: data[0].text,
                    reference: reference,
                    translation: 'KJV'
                };
            }
        } catch (error) {
            console.error('OpenBible API failed:', error);
        }
        return null;
    }

    // Fallback verse content
    getFallbackVerse(reference) {
        const fallbackVerses = {
            'John 3:16': 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
            'Philippians 4:13': 'I can do all things through him who strengthens me.',
            'Jeremiah 29:11': 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.',
            'Romans 8:28': 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.',
            'Psalm 23:1': 'The Lord is my shepherd; I shall not want.',
            'Matthew 11:28': 'Come to me, all who labor and are heavy laden, and I will give you rest.',
            'Isaiah 40:31': 'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.',
            '2 Timothy 1:7': 'For God gave us a spirit not of fear but of power and love and self-control.',
            'Joshua 1:9': 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.',
            '1 Peter 5:7': 'Casting all your anxieties on him, because he cares for you.'
        };
        
        return {
            content: fallbackVerses[reference] || 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
            reference: reference,
            translation: 'Fallback'
        };
    }
}

// Christian Quotes API
class ChristianQuotesAPI {
    constructor(apiManager) {
        this.apiManager = apiManager;
    }

    // Get daily Christian quote
    async getDailyQuote() {
        return this.apiManager.getCachedOrFetch('daily_quote', async () => {
            try {
                const response = await fetch(
                    `${CHRISTIAN_APIS_CONFIG.CONTENT.CHRISTIAN_QUOTES.baseUrl}/quotes/random?tags=faith,christianity,god&maxLength=150`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        quote: data.content,
                        author: data.author,
                        tags: data.tags
                    };
                }
            } catch (error) {
                console.error('Christian Quotes API failed:', error);
            }
            
            // Fallback quotes
            return this.getFallbackQuote();
        });
    }

    // Fallback quotes
    getFallbackQuote() {
        const fallbackQuotes = [
            {
                quote: "Faith is taking the first step even when you don't see the whole staircase.",
                author: "Martin Luther King Jr.",
                tags: ["faith", "trust", "courage"]
            },
            {
                quote: "God never said that the journey would be easy, but He did say that the arrival would be worthwhile.",
                author: "Max Lucado",
                tags: ["journey", "perseverance", "hope"]
            },
            {
                quote: "Prayer does not change God, but it changes him who prays.",
                author: "Søren Kierkegaard",
                tags: ["prayer", "transformation", "growth"]
            }
        ];
        
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

// Christian News API
class ChristianNewsAPI {
    constructor(apiManager) {
        this.apiManager = apiManager;
    }

    // Get latest Christian news
    async getLatestNews(limit = 5) {
        return this.apiManager.getCachedOrFetch('christian_news', async () => {
            try {
                // Parse RSS feeds
                const news = [];
                
                // Christian Post RSS
                const christianPostNews = await this.parseRSSFeed(CHRISTIAN_APIS_CONFIG.NEWS.CHRISTIAN_POST.rssUrl);
                news.push(...christianPostNews.slice(0, Math.ceil(limit / 2)));
                
                // Crosswalk RSS
                const crosswalkNews = await this.parseRSSFeed(CHRISTIAN_APIS_CONFIG.NEWS.CROSSWALK.rssUrl);
                news.push(...crosswalkNews.slice(0, Math.ceil(limit / 2)));
                
                return news.slice(0, limit);
            } catch (error) {
                console.error('Christian News API failed:', error);
                return this.getFallbackNews();
            }
        });
    }

    // Parse RSS feed
    async parseRSSFeed(rssUrl) {
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            
            if (response.ok) {
                const data = await response.json();
                return data.items.map(item => ({
                    title: item.title,
                    description: item.description,
                    link: item.link,
                    published: item.pubDate,
                    source: new URL(rssUrl).hostname
                }));
            }
        } catch (error) {
            console.error('RSS parsing failed:', error);
        }
        return [];
    }

    // Fallback news
    getFallbackNews() {
        return [
            {
                title: "Building Authentic Christian Fellowship",
                description: "Discover how to create meaningful relationships in your Christian community.",
                link: "#",
                published: new Date().toISOString(),
                source: "Fellowship of Believers"
            },
            {
                title: "The Power of Small Group Bible Study",
                description: "Learn how intimate Bible study groups can transform your spiritual life.",
                link: "#",
                published: new Date().toISOString(),
                source: "Fellowship of Believers"
            }
        ];
    }
}

// Christian Calendar API
class ChristianCalendarAPI {
    constructor(apiManager) {
        this.apiManager = apiManager;
    }

    // Get Christian holidays and events
    async getChristianEvents(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
        return this.apiManager.getCachedOrFetch('christian_events', async () => {
            try {
                // For now, return static Christian events
                // In the future, integrate with actual Christian calendar APIs
                return this.getStaticChristianEvents(month, year);
            } catch (error) {
                console.error('Christian Calendar API failed:', error);
                return this.getStaticChristianEvents(month, year);
            }
        });
    }

    // Static Christian events
    getStaticChristianEvents(month, year) {
        const events = [
            { date: '12-25', name: 'Christmas Day', description: 'Celebration of the birth of Jesus Christ' },
            { date: '12-24', name: 'Christmas Eve', description: 'Vigil and preparation for Christmas' },
            { date: '01-06', name: 'Epiphany', description: 'Celebration of the visit of the Magi' },
            { date: '03-31', name: 'Easter Sunday', description: 'Resurrection of Jesus Christ' },
            { date: '04-01', name: 'Easter Monday', description: 'Day after Easter Sunday' },
            { date: '05-09', name: 'Ascension Day', description: 'Ascension of Jesus into heaven' },
            { date: '05-19', name: 'Pentecost', description: 'Descent of the Holy Spirit' },
            { date: '11-01', name: 'All Saints Day', description: 'Commemoration of all saints' }
        ];
        
        return events.filter(event => {
            const [eventMonth, eventDay] = event.date.split('-').map(Number);
            return eventMonth === month;
        });
    }
}

// Main API Integration Class
class ChristianAPIIntegration {
    constructor() {
        this.apiManager = new APIManager();
        this.bibleAPI = new BibleAPI(this.apiManager);
        this.quotesAPI = new ChristianQuotesAPI(this.apiManager);
        this.newsAPI = new ChristianNewsAPI(this.apiManager);
        this.calendarAPI = new ChristianCalendarAPI(this.apiManager);
    }

    // Initialize all APIs
    async initialize() {
        console.log('Initializing Christian APIs...');
        
        try {
            // Load initial content
            await this.loadDailyContent();
            await this.loadNewsContent();
            await this.loadCalendarContent();
            
            console.log('Christian APIs initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Christian APIs:', error);
        }
    }

    // Load daily content
    async loadDailyContent() {
        try {
            // Get daily verse
            const verse = await this.bibleAPI.getVerse('John 3:16');
            this.updateDailyVerse(verse);
            
            // Get daily quote
            const quote = await this.quotesAPI.getDailyQuote();
            this.updateDailyQuote(quote);
        } catch (error) {
            console.error('Failed to load daily content:', error);
        }
    }

    // Load news content
    async loadNewsContent() {
        try {
            const news = await this.newsAPI.getLatestNews(3);
            this.updateNewsSection(news);
        } catch (error) {
            console.error('Failed to load news:', error);
        }
    }

    // Load calendar content
    async loadCalendarContent() {
        try {
            const events = await this.calendarAPI.getChristianEvents();
            this.updateCalendarSection(events);
        } catch (error) {
            console.error('Failed to load calendar:', error);
        }
    }

    // Update daily verse
    updateDailyVerse(verse) {
        const verseText = document.querySelector('.verse-text');
        const verseReference = document.querySelector('.verse-reference');
        
        if (verseText && verseReference) {
            verseText.textContent = verse.content;
            verseReference.textContent = verse.reference;
        }
    }

    // Update daily quote
    updateDailyQuote(quote) {
        // Add quote display to the page if it doesn't exist
        let quoteContainer = document.getElementById('daily-quote-container');
        if (!quoteContainer) {
            quoteContainer = document.createElement('div');
            quoteContainer.id = 'daily-quote-container';
            quoteContainer.className = 'daily-quote-container';
            quoteContainer.innerHTML = `
                <h3>Daily Christian Quote</h3>
                <blockquote>"${quote.quote}"</blockquote>
                <cite>- ${quote.author}</cite>
            `;
            
            // Insert after the daily verse section
            const dailyVerse = document.querySelector('.daily-verse');
            if (dailyVerse) {
                dailyVerse.parentNode.insertBefore(quoteContainer, dailyVerse.nextSibling);
            }
        } else {
            quoteContainer.innerHTML = `
                <h3>Daily Christian Quote</h3>
                <blockquote>"${quote.quote}"</blockquote>
                <cite>- ${quote.author}</cite>
            `;
        }
    }

    // Update news section
    updateNewsSection(news) {
        // Add news section to the page if it doesn't exist
        let newsContainer = document.getElementById('christian-news-container');
        if (!newsContainer) {
            newsContainer = document.createElement('div');
            newsContainer.id = 'christian-news-container';
            newsContainer.className = 'christian-news-section';
            newsContainer.innerHTML = `
                <h3>Latest Christian News</h3>
                <div class="news-grid">
                    ${news.map(item => `
                        <div class="news-item">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="news-meta">
                                <span class="news-source">${item.source}</span>
                                <span class="news-date">${new Date(item.published).toLocaleDateString()}</span>
                            </div>
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Read More</a>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Insert after the scripture section
            const scriptureSection = document.querySelector('.scripture');
            if (scriptureSection) {
                scriptureSection.parentNode.insertBefore(newsContainer, scriptureSection.nextSibling);
            }
        }
    }

    // Update calendar section
    updateCalendarSection(events) {
        // Add calendar section to the page if it doesn't exist
        let calendarContainer = document.getElementById('christian-calendar-container');
        if (!calendarContainer) {
            calendarContainer = document.createElement('div');
            calendarContainer.id = 'christian-calendar-container';
            calendarContainer.className = 'christian-calendar-section';
            calendarContainer.innerHTML = `
                <h3>Christian Calendar</h3>
                <div class="calendar-events">
                    ${events.map(event => `
                        <div class="calendar-event">
                            <div class="event-date">
                                <span class="event-month">${event.date.split('-')[0]}</span>
                                <span class="event-day">${event.date.split('-')[1]}</span>
                            </div>
                            <div class="event-details">
                                <h4>${event.name}</h4>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Insert after the news section
            const newsSection = document.getElementById('christian-news-container');
            if (newsSection) {
                newsSection.parentNode.insertBefore(calendarContainer, newsSection.nextSibling);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const christianAPIs = new ChristianAPIIntegration();
    christianAPIs.initialize();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ChristianAPIIntegration, 
        BibleAPI, 
        ChristianQuotesAPI, 
        ChristianNewsAPI, 
        ChristianCalendarAPI,
        CHRISTIAN_APIS_CONFIG 
    };
} else {
    // Browser environment
    window.ChristianAPIIntegration = ChristianAPIIntegration;
    window.CHRISTIAN_APIS_CONFIG = CHRISTIAN_APIS_CONFIG;
}
