// Firecrawl Configuration and Integration
// Firecrawl is a web scraping and crawling service for extracting data from websites

// Firecrawl Configuration
const FIRECRAWL_CONFIG = {
    // Base URL for Firecrawl API
    BASE_URL: 'https://api.firecrawl.dev',
    
    // API endpoints
    ENDPOINTS: {
        SCRAPE: '/scrape',
        CRAWL: '/crawl',
        SEARCH: '/search',
        EXTRACT: '/extract'
    },
    
    // Default configuration options
    DEFAULT_OPTIONS: {
        // Scraping options
        scrape: {
            pageOptions: {
                onlyMainContent: true,
                includeHtml: false,
                includeMarkdown: true,
                includeScreenshots: false,
                includeLinks: true,
                includeImages: false
            },
            screenshotOptions: {
                fullPage: false,
                quality: 80,
                format: 'png'
            }
        },
        
        // Crawling options
        crawl: {
            maxPages: 10,
            maxDepth: 2,
            followRedirects: true,
            includeSubdomains: false,
            excludePatterns: ['/admin/*', '/private/*', '/api/*']
        },
        
        // Search options
        search: {
            maxResults: 20,
            includeMetadata: true,
            sortBy: 'relevance'
        }
    },
    
    // Rate limiting (adjust based on your plan)
    RATE_LIMITS: {
        FREE_TIER: {
            requestsPerMinute: 10,
            requestsPerHour: 100,
            requestsPerDay: 1000
        },
        PAID_TIER: {
            requestsPerMinute: 100,
            requestsPerHour: 1000,
            requestsPerDay: 10000
        }
    }
};

// Firecrawl API Functions
class FirecrawlAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = FIRECRAWL_CONFIG.BASE_URL;
        this.requestCount = 0;
        this.lastRequestTime = 0;
    }

    // Rate limiting helper
    async checkRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        // Basic rate limiting - 1 request per second minimum
        if (timeSinceLastRequest < 1000) {
            await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
        }
        
        this.lastRequestTime = now;
        this.requestCount++;
    }

    // Make API request with authentication
    async makeRequest(endpoint, options = {}) {
        await this.checkRateLimit();
        
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(options)
            });

            if (!response.ok) {
                throw new Error(`Firecrawl API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Firecrawl API request failed:', error);
            throw error;
        }
    }

    // Scrape a single webpage
    async scrapeUrl(url, options = {}) {
        const scrapeOptions = {
            ...FIRECRAWL_CONFIG.DEFAULT_OPTIONS.scrape,
            ...options,
            url: url
        };

        return await this.makeRequest(FIRECRAWL_CONFIG.ENDPOINTS.SCRAPE, scrapeOptions);
    }

    // Crawl a website (multiple pages)
    async crawlWebsite(url, options = {}) {
        const crawlOptions = {
            ...FIRECRAWL_CONFIG.DEFAULT_OPTIONS.crawl,
            ...options,
            url: url
        };

        return await this.makeRequest(FIRECRAWL_CONFIG.ENDPOINTS.CRAWL, crawlOptions);
    }

    // Search across crawled content
    async searchContent(query, options = {}) {
        const searchOptions = {
            ...FIRECRAWL_CONFIG.DEFAULT_OPTIONS.search,
            ...options,
            query: query
        };

        return await this.makeRequest(FIRECRAWL_CONFIG.ENDPOINTS.SEARCH, searchOptions);
    }

    // Extract specific data from scraped content
    async extractData(content, extractionRules) {
        const extractOptions = {
            content: content,
            rules: extractionRules
        };

        return await this.makeRequest(FIRECRAWL_CONFIG.ENDPOINTS.EXTRACT, extractOptions);
    }
}

// Integration with the Christian Fellowship Website
class FellowshipFirecrawl {
    constructor(apiKey) {
        this.firecrawl = new FirecrawlAPI(apiKey);
    }

    // Scrape Christian resources and articles
    async scrapeChristianResources(urls) {
        const resources = [];
        
        for (const url of urls) {
            try {
                const result = await this.firecrawl.scrapeUrl(url, {
                    pageOptions: {
                        onlyMainContent: true,
                        includeMarkdown: true,
                        includeLinks: true
                    }
                });
                
                resources.push({
                    url: url,
                    title: result.data.title,
                    content: result.data.markdown || result.data.text,
                    links: result.data.links || [],
                    scrapedAt: new Date().toISOString()
                });
            } catch (error) {
                console.error(`Failed to scrape ${url}:`, error);
            }
        }
        
        return resources;
    }

    // Crawl Christian websites for study materials
    async crawlStudyMaterials(baseUrl) {
        try {
            const result = await this.firecrawl.crawlWebsite(baseUrl, {
                maxPages: 20,
                maxDepth: 3,
                excludePatterns: ['/admin/*', '/private/*', '/api/*', '*.pdf', '*.doc']
            });
            
            return result.data.pages.map(page => ({
                url: page.url,
                title: page.title,
                content: page.markdown || page.text,
                depth: page.depth,
                links: page.links || []
            }));
        } catch (error) {
            console.error('Failed to crawl study materials:', error);
            throw error;
        }
    }

    // Search for specific topics in scraped content
    async searchStudyTopics(query, content) {
        try {
            const result = await this.firecrawl.searchContent(query, {
                content: content,
                maxResults: 10
            });
            
            return result.data.results;
        } catch (error) {
            console.error('Failed to search study topics:', error);
            throw error;
        }
    }

    // Extract Bible study information
    async extractBibleStudyInfo(content) {
        const extractionRules = {
            title: 'Extract the main title or topic',
            scripture: 'Extract Bible references and verses',
            keyPoints: 'Extract main points or takeaways',
            questions: 'Extract discussion questions',
            prayer: 'Extract prayer points or requests'
        };

        try {
            const result = await this.firecrawl.extractData(content, extractionRules);
            return result.data.extracted;
        } catch (error) {
            console.error('Failed to extract Bible study info:', error);
            throw error;
        }
    }
}

// Usage Examples and Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firecrawl (replace with your actual API key)
    const fellowshipFirecrawl = new FellowshipFirecrawl('YOUR_FIRECRAWL_API_KEY');
    
    // Example: Scrape Christian resources
    async function loadChristianResources() {
        const christianUrls = [
            'https://www.gotquestions.org/',
            'https://www.biblestudytools.com/',
            'https://www.blueletterbible.org/'
        ];
        
        try {
            const resources = await fellowshipFirecrawl.scrapeChristianResources(christianUrls);
            console.log('Scraped Christian resources:', resources);
            
            // You can now use these resources in your website
            displayScrapedResources(resources);
        } catch (error) {
            console.error('Failed to load Christian resources:', error);
        }
    }
    
    // Example: Display scraped resources
    function displayScrapedResources(resources) {
        const container = document.getElementById('scraped-resources');
        if (!container) return;
        
        const resourcesHTML = resources.map(resource => `
            <div class="scraped-resource">
                <h3>${resource.title}</h3>
                <p>${resource.content.substring(0, 200)}...</p>
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                    Read More
                </a>
            </div>
        `).join('');
        
        container.innerHTML = resourcesHTML;
    }
    
    // Example: Search functionality
    async function searchStudyContent(query) {
        try {
            const results = await fellowshipFirecrawl.searchStudyTopics(query);
            console.log('Search results:', results);
            
            // Display search results in your website
            displaySearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }
    
    // Example: Display search results
    function displaySearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;
        
        const resultsHTML = results.map(result => `
            <div class="search-result">
                <h4>${result.title}</h4>
                <p>${result.snippet}</p>
                <span class="relevance">Relevance: ${result.relevance}%</span>
            </div>
        `).join('');
        
        container.innerHTML = resultsHTML;
    }
    
    // Initialize if API key is available
    if (typeof window.FIRECRAWL_API_KEY !== 'undefined' && window.FIRECRAWL_API_KEY !== 'YOUR_FIRECRAWL_API_KEY') {
        // Load resources on page load
        loadChristianResources();
        
        // Set up search functionality
        const searchInput = document.getElementById('study-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                if (this.value.length > 2) {
                    searchStudyContent(this.value);
                }
            }, 500));
        }
    }
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FirecrawlAPI, FellowshipFirecrawl, FIRECRAWL_CONFIG };
} else {
    // Browser environment
    window.FirecrawlAPI = FirecrawlAPI;
    window.FellowshipFirecrawl = FellowshipFirecrawl;
    window.FIRECRAWL_CONFIG = FIRECRAWL_CONFIG;
}
