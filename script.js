// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show success message (in a real app, this would send to Supabase)
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature, .fellowship-card, .community-card, .resource-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Add CSS for animations
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .feature, .fellowship-card, .community-card, .resource-item {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            
            .feature.animate-in, .fellowship-card.animate-in, .community-card.animate-in, .resource-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .feature:nth-child(1) { transition-delay: 0.1s; }
            .feature:nth-child(2) { transition-delay: 0.2s; }
            .feature:nth-child(3) { transition-delay: 0.3s; }
            .feature:nth-child(4) { transition-delay: 0.4s; }
            
            .fellowship-card:nth-child(1) { transition-delay: 0.1s; }
            .fellowship-card:nth-child(2) { transition-delay: 0.2s; }
            .fellowship-card:nth-child(3) { transition-delay: 0.3s; }
            .fellowship-card:nth-child(4) { transition-delay: 0.4s; }
        `;
        document.head.appendChild(style);
    }
});

// Bible API Integration
const BIBLE_API_BASE_URL = 'https://api.scripture.api.bible/v1';
const BIBLE_ID = 'de4e12af7f28f599-02'; // English Standard Version (ESV)
let currentBibleId = BIBLE_ID;

// Bible API Functions
async function fetchBibleVerse(reference) {
    try {
        const response = await fetch(`${BIBLE_API_BASE_URL}/bibles/${currentBibleId}/search?query=${encodeURIComponent(reference)}`, {
            headers: {
                'api-key': 'YOUR_API_KEY_HERE' // Replace with your actual API key
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch verse');
        }
        
        const data = await response.json();
        return data.data.passages[0];
    } catch (error) {
        console.error('Error fetching Bible verse:', error);
        return null;
    }
}

async function fetchDailyVerse() {
    // Array of encouraging verses for daily display
    const dailyVerses = [
        'John 3:16',
        'Philippians 4:13',
        'Jeremiah 29:11',
        'Romans 8:28',
        'Psalm 23:1',
        'Matthew 11:28',
        'Isaiah 40:31',
        '2 Timothy 1:7',
        'Joshua 1:9',
        '1 Peter 5:7'
    ];
    
    // Get today's date to select a verse
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const verseIndex = dayOfYear % dailyVerses.length;
    const selectedVerse = dailyVerses[verseIndex];
    
    try {
        const passage = await fetchBibleVerse(selectedVerse);
        if (passage) {
            updateDailyVerse(passage.content, selectedVerse);
        } else {
            // Fallback to static verse if API fails
            updateDailyVerseFallback(selectedVerse);
        }
    } catch (error) {
        updateDailyVerseFallback(selectedVerse);
    }
}

function updateDailyVerse(content, reference) {
    const verseText = document.querySelector('.verse-text');
    const verseReference = document.querySelector('.verse-reference');
    
    if (verseText && verseReference) {
        // Clean HTML content from API
        const cleanContent = content.replace(/<[^>]*>/g, '');
        verseText.textContent = cleanContent;
        verseReference.textContent = reference;
    }
}

function updateDailyVerseFallback(reference) {
    const verseText = document.querySelector('.verse-text');
    const verseReference = document.querySelector('.verse-reference');
    
    if (verseText && verseReference) {
        // Fallback verses
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
        
        verseText.textContent = fallbackVerses[reference] || 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.';
        verseReference.textContent = reference;
    }
}

// Bible Search Functionality
async function searchBible(query) {
    try {
        const response = await fetch(`${BIBLE_API_BASE_URL}/bibles/${currentBibleId}/search?query=${encodeURIComponent(query)}&limit=10`, {
            headers: {
                'api-key': 'YOUR_API_KEY_HERE' // Replace with your actual API key
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to search Bible');
        }
        
        const data = await response.json();
        return data.data.passages;
    } catch (error) {
        console.error('Error searching Bible:', error);
        return [];
    }
}

// Initialize Bible functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load daily verse
    fetchDailyVerse();
    
    // Initialize Bible search
    initializeBibleSearch();
    
    // Initialize Firecrawl integration
    initializeFirecrawl();
    
    // Add Bible search functionality to study resources
    const studyResources = document.querySelectorAll('.resource-item');
    studyResources.forEach(resource => {
        resource.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceType = this.querySelector('span').textContent;
            
            if (resourceType === 'New Testament Overview') {
                showBibleOverview();
            } else if (resourceType === 'Daily Devotionals') {
                showDailyDevotionals();
            } else if (resourceType === 'Bible Q&A') {
                showBibleQA();
            } else if (resourceType === 'Church History') {
                showChurchHistory();
            }
        });
    });
});

// Initialize Firecrawl Integration
function initializeFirecrawl() {
    const loadResourcesBtn = document.getElementById('load-resources-btn');
    const studySearchInput = document.getElementById('study-search');
    
    if (loadResourcesBtn) {
        loadResourcesBtn.addEventListener('click', loadChristianResources);
    }
    
    if (studySearchInput) {
        studySearchInput.addEventListener('input', debounce(function() {
            if (this.value.length > 2) {
                searchStudyContent(this.value);
            }
        }, 500));
    }
}

// Load Christian resources using Firecrawl
async function loadChristianResources() {
    const container = document.getElementById('scraped-resources');
    const loadBtn = document.getElementById('load-resources-btn');
    
    if (!container || !loadBtn) return;
    
    // Show loading state
    loadBtn.disabled = true;
    loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    container.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Fetching Christian study resources...</p></div>';
    
    try {
        // Check if Firecrawl is available
        if (typeof window.FellowshipFirecrawl === 'undefined') {
            throw new Error('Firecrawl not initialized. Please check your API key configuration.');
        }
        
        // Initialize with your API key (replace with actual key)
        const fellowshipFirecrawl = new window.FellowshipFirecrawl('YOUR_FIRECRAWL_API_KEY');
        
        // Define Christian resource URLs to scrape
        const christianUrls = [
            'https://www.gotquestions.org/',
            'https://www.biblestudytools.com/',
            'https://www.blueletterbible.org/',
            'https://www.biblegateway.com/',
            'https://www.crosswalk.com/'
        ];
        
        const resources = await fellowshipFirecrawl.scrapeChristianResources(christianUrls);
        
        if (resources && resources.length > 0) {
            displayScrapedResources(resources);
        } else {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No resources found. Please try again later.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load Christian resources:', error);
        container.innerHTML = `
            <div class="search-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load resources at this time.</p>
                <p class="error-details">${error.message}</p>
                <button class="btn btn-outline" onclick="loadChristianResources()">Try Again</button>
            </div>
        `;
    } finally {
        // Reset button state
        loadBtn.disabled = false;
        loadBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Load Resources';
    }
}

// Display scraped resources
function displayScrapedResources(resources) {
    const container = document.getElementById('scraped-resources');
    if (!container) return;
    
    const resourcesHTML = resources.map(resource => {
        const truncatedContent = resource.content && resource.content.length > 200 
            ? resource.content.substring(0, 200) + '...' 
            : resource.content || 'Content not available';
        
        const links = resource.links && resource.links.length > 0 
            ? resource.links.slice(0, 5).map(link => 
                `<a href="${link}" class="resource-link" target="_blank" rel="noopener noreferrer">${new URL(link).hostname}</a>`
            ).join('') 
            : '';
        
        return `
            <div class="scraped-resource">
                <h3>${resource.title || 'Untitled Resource'}</h3>
                <p>${truncatedContent}</p>
                <div class="resource-meta">
                    <span>Source: ${new URL(resource.url).hostname}</span>
                    <div class="resource-links">
                        ${links}
                    </div>
                </div>
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                    Read Full Article →
                </a>
            </div>
        `;
    }).join('');
    
    container.innerHTML = resourcesHTML;
}

// Search study content
async function searchStudyContent(query) {
    const container = document.getElementById('scraped-resources');
    if (!container) return;
    
    // Show search loading
    container.innerHTML = '<div class="loading-placeholder"><i class="fas fa-search"></i><p>Searching for "${query}"...</p></div>';
    
    try {
        if (typeof window.FellowshipFirecrawl === 'undefined') {
            throw new Error('Firecrawl not initialized');
        }
        
        const fellowshipFirecrawl = new window.FellowshipFirecrawl('YOUR_FIRECRAWL_API_KEY');
        
        // For now, we'll search through already loaded resources
        // In a full implementation, you could search across multiple sites
        const searchResults = await fellowshipFirecrawl.searchStudyTopics(query);
        
        if (searchResults && searchResults.length > 0) {
            displaySearchResults(searchResults);
        } else {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                    <p>Try different keywords or load resources first</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Search failed:', error);
        container.innerHTML = `
            <div class="search-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Search failed. Please try again.</p>
            </div>
        `;
    }
}

// Display search results
function displaySearchResults(results) {
    const container = document.getElementById('scraped-resources');
    if (!container) return;
    
    const resultsHTML = results.map(result => `
        <div class="scraped-resource">
            <h3>${result.title || 'Search Result'}</h3>
            <p>${result.snippet || result.content || 'Content preview not available'}</p>
            <div class="resource-meta">
                <span>Relevance: ${result.relevance || 'N/A'}%</span>
                <span>Source: ${result.source || 'Unknown'}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
}

// Debounce utility function
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

// Initialize Bible Search
function initializeBibleSearch() {
    const searchInput = document.getElementById('bible-search-input');
    const searchBtn = document.getElementById('bible-search-btn');
    const searchResults = document.getElementById('search-results');
    
    if (searchBtn && searchInput) {
        // Search on button click
        searchBtn.addEventListener('click', performBibleSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performBibleSearch();
            }
        });
    }
}

// Perform Bible Search
async function performBibleSearch() {
    const searchInput = document.getElementById('bible-search-input');
    const searchResults = document.getElementById('search-results');
    const query = searchInput.value.trim();
    
    if (!query) {
        showNotification('Please enter a search term', 'error');
        return;
    }
    
    // Show loading state
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<div class="search-loading">Searching Scripture...</div>';
    
    try {
        const passages = await searchBible(query);
        
        if (passages && passages.length > 0) {
            displaySearchResults(passages);
        } else {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${query}"</p>
                    <p>Try different keywords or check the spelling</p>
                </div>
            `;
        }
    } catch (error) {
        searchResults.innerHTML = `
            <div class="search-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to search at this time. Please try again later.</p>
            </div>
        `;
    }
}

// Display Search Results
function displaySearchResults(passages) {
    const searchResults = document.getElementById('search-results');
    
    const resultsHTML = passages.map(passage => {
        const cleanContent = passage.content.replace(/<[^>]*>/g, '');
        const truncatedContent = cleanContent.length > 200 
            ? cleanContent.substring(0, 200) + '...' 
            : cleanContent;
        
        return `
            <div class="search-result-item" onclick="showPassageModal('${passage.reference}', '${cleanContent.replace(/'/g, "\\'")}')">
                <h5>${passage.reference}</h5>
                <p>${truncatedContent}</p>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
}

// Show Passage Modal
function showPassageModal(reference, content) {
    const modal = createModal(`Bible Passage - ${reference}`, `
        <div class="bible-passage">
            <div class="passage-header">
                <h4>${reference}</h4>
                <button class="btn btn-outline" onclick="copyToClipboard('${content.replace(/'/g, "\\'")}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="passage-content">
                <p>${content}</p>
            </div>
            <div class="passage-actions">
                <button class="btn btn-primary" onclick="sharePassage('${reference}', '${content.replace(/'/g, "\\'")}')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Passage copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Unable to copy passage', 'error');
    });
}

// Share Passage
function sharePassage(reference, content) {
    const shareText = `${content} - ${reference}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Bible Passage',
            text: shareText,
            url: window.location.href
        });
    } else {
        copyToClipboard(shareText);
    }
}

// Bible Study Resources Functions
function showBibleOverview() {
    const modal = createModal('New Testament Overview', `
        <div class="bible-overview">
            <h3>New Testament Books</h3>
            <div class="book-categories">
                <div class="category">
                    <h4>Gospels</h4>
                    <ul>
                        <li>Matthew - Jesus as the Messiah King</li>
                        <li>Mark - Jesus as the Servant</li>
                        <li>Luke - Jesus as the Perfect Man</li>
                        <li>John - Jesus as the Son of God</li>
                    </ul>
                </div>
                <div class="category">
                    <h4>History</h4>
                    <ul>
                        <li>Acts - The Early Church</li>
                    </ul>
                </div>
                <div class="category">
                    <h4>Pauline Epistles</h4>
                    <ul>
                        <li>Romans - Righteousness by Faith</li>
                        <li>1-2 Corinthians - Church Issues</li>
                        <li>Galatians - Freedom in Christ</li>
                        <li>Ephesians - Unity in Christ</li>
                        <li>Philippians - Joy in Christ</li>
                        <li>Colossians - Preeminence of Christ</li>
                        <li>1-2 Thessalonians - Second Coming</li>
                        <li>1-2 Timothy - Church Leadership</li>
                        <li>Titus - Church Organization</li>
                        <li>Philemon - Forgiveness</li>
                    </ul>
                </div>
                <div class="category">
                    <h4>General Epistles</h4>
                    <ul>
                        <li>Hebrews - Superiority of Christ</li>
                        <li>James - Faith and Works</li>
                        <li>1-2 Peter - Suffering and Hope</li>
                        <li>1-3 John - Love and Truth</li>
                        <li>Jude - Contending for Faith</li>
                    </ul>
                </div>
                <div class="category">
                    <h4>Prophecy</h4>
                    <ul>
                        <li>Revelation - Christ's Victory</li>
                    </ul>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function showDailyDevotionals() {
    const modal = createModal('Daily Devotionals', `
        <div class="daily-devotionals">
            <h3>Today's Devotional</h3>
            <div class="devotional-content">
                <h4>Walking in Faith</h4>
                <p class="devotional-text">
                    "Now faith is the assurance of things hoped for, the conviction of things not seen." - Hebrews 11:1
                </p>
                <p>
                    Faith is not just believing in something we can't see; it's trusting in God's character and promises. 
                    Like Abraham, who left his homeland not knowing where he was going, we are called to walk by faith, 
                    not by sight. Every step of obedience is a step of faith.
                </p>
                <div class="devotional-prayer">
                    <h5>Prayer:</h5>
                    <p>Lord, help me to trust You more each day. Give me the faith to follow Your leading, even when 
                    the path ahead is unclear. Strengthen my conviction in Your promises and help me to walk in obedience. Amen.</p>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function showBibleQA() {
    const modal = createModal('Bible Q&A', `
        <div class="bible-qa">
            <h3>Frequently Asked Questions</h3>
            <div class="qa-list">
                <div class="qa-item">
                    <h4>Q: What is the main message of the New Testament?</h4>
                    <p>A: The main message is the good news (gospel) of Jesus Christ - His life, death, resurrection, 
                    and the salvation He offers to all who believe in Him.</p>
                </div>
                <div class="qa-item">
                    <h4>Q: How should I start reading the Bible?</h4>
                    <p>A: Begin with the Gospel of John to understand who Jesus is, then read the other Gospels, 
                    followed by Acts and the Epistles. Start with small portions and pray for understanding.</p>
                </div>
                <div class="qa-item">
                    <h4>Q: What is the difference between the Old and New Testaments?</h4>
                    <p>A: The Old Testament contains God's promises and prophecies about the coming Messiah, while 
                    the New Testament shows the fulfillment of those promises in Jesus Christ.</p>
                </div>
                <div class="qa-item">
                    <h4>Q: How can I apply the Bible to my daily life?</h4>
                    <p>A: Read Scripture daily, meditate on its meaning, pray for wisdom, and look for practical 
                    ways to live out biblical principles in your relationships, work, and decisions.</p>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function showChurchHistory() {
    const modal = createModal('Church History', `
        <div class="church-history">
            <h3>Early Church History</h3>
            <div class="timeline">
                <div class="timeline-item">
                    <h4>30-33 AD</h4>
                    <p>Death, resurrection, and ascension of Jesus Christ</p>
                </div>
                <div class="timeline-item">
                    <h4>33 AD</h4>
                    <p>Day of Pentecost - Holy Spirit descends on believers</p>
                </div>
                <div class="timeline-item">
                    <h4>33-70 AD</h4>
                    <p>Early church spreads throughout Roman Empire</p>
                </div>
                <div class="timeline-item">
                    <h4>70 AD</h4>
                    <p>Destruction of Jerusalem Temple</p>
                </div>
                <div class="timeline-item">
                    <h4>100-300 AD</h4>
                    <p>Period of persecution and church growth</p>
                </div>
                <div class="timeline-item">
                    <h4>313 AD</h4>
                    <p>Edict of Milan - Christianity legalized</p>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

// Modal creation helper
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    return modal;
}

// Share verse functionality
document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.querySelector('.daily-verse .btn-primary');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            const verseText = document.querySelector('.verse-text').textContent;
            const verseReference = document.querySelector('.verse-reference').textContent;
            const shareText = `${verseText} - ${verseReference}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Daily Bible Verse',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(shareText).then(() => {
                    showNotification('Verse copied to clipboard!', 'success');
                }).catch(() => {
                    showNotification('Unable to copy verse.', 'error');
                });
            }
        });
    }
});
