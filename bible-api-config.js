// Bible API Configuration
// This file contains the configuration for the Bible API integration

// API Configuration
const BIBLE_API_CONFIG = {
    // Base URL for the Bible API
    BASE_URL: 'https://api.scripture.api.bible/v1',
    
    // Default Bible version (ESV - English Standard Version)
    DEFAULT_BIBLE_ID: 'de4e12af7f28f599-02',
    
    // Available Bible versions
    BIBLE_VERSIONS: {
        'ESV': 'de4e12af7f28f599-02',      // English Standard Version
        'NIV': '78a9f6124f344018-01',      // New International Version
        'KJV': 'de4e12af7f28f599-01',      // King James Version
        'NKJV': 'de4e12af7f28f599-03',     // New King James Version
        'NLT': '65eec8e0b60e656b-01',      // New Living Translation
        'NASB': 'de4e12af7f28f599-04',     // New American Standard Bible
        'CSB': 'de4e12af7f28f599-05',      // Christian Standard Bible
        'RSV': 'de4e12af7f28f599-06',      // Revised Standard Version
        'ASV': 'de4e12af7f28f599-07',      // American Standard Version
        'WEB': 'de4e12af7f28f599-08'       // World English Bible
    },
    
    // API endpoints
    ENDPOINTS: {
        SEARCH: '/search',
        PASSAGES: '/passages',
        BIBLES: '/bibles',
        BOOKS: '/books',
        CHAPTERS: '/chapters',
        VERSES: '/verses'
    },
    
    // Search parameters
    SEARCH_PARAMS: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 50,
        DEFAULT_OFFSET: 0
    }
};

// How to get your Bible API key:
// 1. Go to https://scripture.api.bible/
// 2. Sign up for a free account
// 3. Get your API key from the dashboard
// 4. Replace 'YOUR_API_KEY_HERE' in script.js with your actual API key

// Usage Examples:
// - Search for verses: searchBible('love')
// - Get specific passage: fetchBibleVerse('John 3:16')
// - Change Bible version: currentBibleId = BIBLE_API_CONFIG.BIBLE_VERSIONS.NIV

// API Rate Limits (Free Tier):
// - 1000 requests per month
// - 10 requests per minute
// - 100 requests per hour

// Error Handling:
// The API will return errors for:
// - Invalid API key
// - Rate limit exceeded
// - Invalid Bible ID
// - Invalid search query
// - Network issues

// Fallback Content:
// If the API fails, the website will display fallback content
// to ensure users always see Bible content

// Security Notes:
// - Never expose your API key in client-side code for production
// - Use environment variables in production
// - Consider implementing server-side API calls for security

// Production Deployment:
// For production, consider:
// 1. Moving API calls to server-side
// 2. Implementing caching
// 3. Adding error monitoring
// 4. Setting up API key rotation

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BIBLE_API_CONFIG;
} else {
    // Browser environment
    window.BIBLE_API_CONFIG = BIBLE_API_CONFIG;
}
