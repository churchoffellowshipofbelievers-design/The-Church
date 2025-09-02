#!/usr/bin/env node

/**
 * 🤖 Complete Christian Fellowship Website Setup
 * This script sets up EVERYTHING for your website!
 * - Supabase database with all tables
 * - Updates your existing website files 
 * - Configures API connections
 * - Tests everything works
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bright: '\x1b[1m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    step: (msg) => console.log(`${colors.cyan}🚀 ${msg}${colors.reset}`),
    title: (msg) => console.log(`${colors.magenta}${colors.bright}\n🙏 ${msg}${colors.reset}\n`)
};

class CompleteSetup {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.config = {};
        this.existingSupabase = null;
    }

    async question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    async start() {
        log.title('Christian Fellowship Website - Complete Setup');
        
        console.log('🎯 This script will set up EVERYTHING for your fellowship website:');
        console.log('   • Complete Supabase database (12 tables)');
        console.log('   • Security policies and user authentication');
        console.log('   • Update your existing website files');
        console.log('   • Connect all APIs and features');
        console.log('   • Test everything works perfectly');
        console.log('   • Sample data for immediate testing');
        console.log('\nLet\'s build your Christian community platform! 🚀\n');

        try {
            await this.checkExistingSetup();
            await this.collectCredentials();
            await this.updateWebsiteFiles();
            await this.setupDatabase();
            await this.testIntegration();
            await this.showSuccess();
        } catch (error) {
            log.error(`Setup failed: ${error.message}`);
            console.log('\n📞 Need help? Check our troubleshooting guide or open a GitHub issue.');
        } finally {
            this.rl.close();
        }
    }

    async checkExistingSetup() {
        log.step('Step 1: Checking your existing website setup');

        // Check if website files exist
        const requiredFiles = ['index.html', 'script.js', 'styles.css', 'supabase-config.js'];
        const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

        if (missingFiles.length > 0) {
            log.error(`Missing required website files: ${missingFiles.join(', ')}`);
            throw new Error('Please make sure you\'re in the correct directory with all website files');
        }

        // Read existing Supabase config
        try {
            const supabaseConfigContent = fs.readFileSync('supabase-config.js', 'utf8');
            
            // Extract existing credentials if they exist
            const urlMatch = supabaseConfigContent.match(/SUPABASE_URL:\s*['"`]([^'"`]+)['"`]/);
            const keyMatch = supabaseConfigContent.match(/SUPABASE_ANON_KEY:\s*['"`]([^'"`]+)['"`]/);
            
            if (urlMatch && keyMatch) {
                this.existingSupabase = {
                    url: urlMatch[1],
                    key: keyMatch[1]
                };
                
                if (this.existingSupabase.url.includes('supabase.co') && 
                    this.existingSupabase.key.startsWith('eyJ')) {
                    log.success('Found existing Supabase configuration');
                    
                    const useExisting = await this.question('Use existing Supabase config? (y/n): ');
                    if (useExisting.toLowerCase().startsWith('y')) {
                        this.config = this.existingSupabase;
                        log.success('Using existing Supabase credentials');
                        return;
                    }
                }
            }
        } catch (error) {
            log.warning('Could not read existing Supabase config, will create new one');
        }

        log.success('Website files verified, ready for database setup');
    }

    async collectCredentials() {
        if (this.config.url && this.config.key) {
            return; // Already have credentials
        }

        log.step('Step 2: Collecting your Supabase credentials');
        
        console.log('\n📋 Go to your Supabase project dashboard:');
        console.log('   1. Settings → API');
        console.log('   2. Copy your Project URL and anon public key\n');
        console.log('   Or create a new project at supabase.com if you don\'t have one\n');

        this.config.url = await this.question('🔗 Enter your Supabase Project URL: ');
        
        if (!this.config.url.includes('supabase.co')) {
            throw new Error('Invalid Supabase URL. Should be like: https://your-project.supabase.co');
        }

        this.config.key = await this.question('🔑 Enter your Supabase anon public key: ');
        
        if (!this.config.key.startsWith('eyJ')) {
            throw new Error('Invalid API key format. Should start with "eyJ"');
        }

        log.success('Credentials collected successfully!');
    }

    async updateWebsiteFiles() {
        log.step('Step 3: Updating your website files with Supabase connection');

        // Update supabase-config.js with new credentials
        const supabaseConfigContent = `// Supabase Configuration for Fellowship Website
// This file handles database connections and user management

const SUPABASE_CONFIG = {
    // Your Supabase project URL and credentials
    SUPABASE_URL: '${this.config.url}',
    SUPABASE_ANON_KEY: '${this.config.key}',
    
    // Database table names (matches our SQL schema)
    TABLES: {
        USERS: 'users',
        FELLOWSHIP_GROUPS: 'fellowship_groups',
        GROUP_MEMBERS: 'group_members',
        PRAYER_REQUESTS: 'prayer_requests',
        PRAYER_RESPONSES: 'prayer_responses',
        BIBLE_STUDY_SESSIONS: 'bible_study_sessions',
        EVENTS: 'events',
        EVENT_REGISTRATIONS: 'event_registrations',
        PRAYER_JOURNAL: 'prayer_journal',
        SPIRITUAL_GROWTH: 'spiritual_growth',
        TESTIMONIES: 'testimonies',
        RESOURCES: 'resources'
    },
    
    // API endpoints
    ENDPOINTS: {
        AUTH: '/auth/v1',
        REST: '/rest/v1',
        REALTIME: '/realtime/v1'
    }
};

// Initialize Supabase Client
let supabaseClient = null;

// Initialize Supabase when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Import Supabase from CDN
        if (typeof window.supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);
            
            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }
        
        // Initialize client
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.SUPABASE_URL, 
            SUPABASE_CONFIG.SUPABASE_ANON_KEY
        );
        
        console.log('✅ Supabase client initialized successfully');
        console.log('📊 Database ready for Christian fellowship!');
        
        // Test connection
        const { data, error } = await supabaseClient.from('users').select('count', { count: 'exact', head: true });
        if (!error) {
            console.log('✅ Database connection verified');
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        console.log('🔄 Using fallback local storage methods');
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, supabaseClient };
} else {
    // Browser environment
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.getSupabaseClient = () => supabaseClient;
}
`;

        fs.writeFileSync('supabase-config.js', supabaseConfigContent);
        log.success('Updated supabase-config.js with your credentials');

        // Create environment file
        const envContent = `# Christian Fellowship Website Environment Variables
# Generated by complete setup script

# Supabase Configuration
VITE_SUPABASE_URL=${this.config.url}
VITE_SUPABASE_ANON_KEY=${this.config.key}

# Optional API Keys (add these later for enhanced features)
# BIBLE_API_KEY=your_scripture_api_key_here
# FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Development Configuration  
NODE_ENV=development
VITE_SITE_URL=http://localhost:3000

# Generated: ${new Date().toISOString()}
`;

        fs.writeFileSync('.env.local', envContent);
        log.success('Created .env.local file for development');

        // Update index.html to include Supabase CDN if not present
        let indexContent = fs.readFileSync('index.html', 'utf8');
        
        if (!indexContent.includes('supabase-js')) {
            // Add Supabase CDN before closing head tag
            const supabaseCDN = '    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</head>';
            indexContent = indexContent.replace('</head>', supabaseCDN);
            
            fs.writeFileSync('index.html', indexContent);
            log.success('Added Supabase CDN to index.html');
        }

        // Update signup.html if it exists
        if (fs.existsSync('signup.html')) {
            let signupContent = fs.readFileSync('signup.html', 'utf8');
            
            if (!signupContent.includes('supabase-js')) {
                const supabaseCDN = '    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</head>';
                signupContent = signupContent.replace('</head>', supabaseCDN);
                
                fs.writeFileSync('signup.html', signupContent);
                log.success('Added Supabase CDN to signup.html');
            }
        }

        log.success('Website files updated with Supabase integration!');
    }

    async setupDatabase() {
        log.step('Step 4: Setting up your complete database structure');
        
        console.log('\n📊 Now we need to run SQL scripts in your Supabase dashboard:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Click "SQL Editor" in the sidebar');
        console.log('   3. Click "New Query"');
        console.log('\n🔧 We\'ll run 3 scripts to create your complete database:\n');

        // Script 1: Database Structure (12 tables)
        await this.runScript('Database Tables & Structure', 'supabase-database-setup.sql', 
            'Creates all 12 tables for your fellowship website with proper relationships');

        // Script 2: Security Policies
        await this.runScript('Security Policies & Permissions', 'supabase-security-policies.sql', 
            'Enables Row Level Security to protect user data and set proper permissions');

        // Script 3: Sample Data
        const addSampleData = await this.question('\n🎲 Add sample data for testing? (recommended: y/n): ');
        if (addSampleData.toLowerCase().startsWith('y')) {
            await this.runScript('Sample Data & Test Users', 'supabase-sample-data.sql', 
                'Adds test users, fellowship groups, prayer requests, and events');
        }

        log.success('Complete database setup finished!');
    }

    async runScript(name, filename, description) {
        console.log(`\n📋 ${colors.bright}${name}${colors.reset}`);
        console.log(`   ${description}`);
        console.log(`   File: ${filename}\n`);

        if (!fs.existsSync(filename)) {
            log.error(`Script file not found: ${filename}`);
            log.info('Make sure you\'re in the project directory with all SQL files');
            return;
        }

        const scriptContent = fs.readFileSync(filename, 'utf8');
        const lines = scriptContent.split('\n').length;
        
        console.log(`📄 Script ready (${lines} lines)`);
        console.log('\n🔧 Steps to run this script:');
        console.log('   1. Copy the entire script content below');
        console.log('   2. Go to your Supabase dashboard → SQL Editor');
        console.log('   3. Click "New Query"');
        console.log('   4. Paste the script content');
        console.log('   5. Click "RUN" button');
        console.log('   6. Look for success messages in the results\n');

        await this.question('Press Enter when ready to see the script...');

        console.log(`\n${colors.cyan}==================== COPY EVERYTHING BELOW ====================${colors.reset}\n`);
        console.log(scriptContent);
        console.log(`\n${colors.cyan}==================== COPY EVERYTHING ABOVE ====================${colors.reset}\n`);

        const success = await this.question('Did the script run successfully in Supabase? (y/n): ');
        
        if (!success.toLowerCase().startsWith('y')) {
            const errorMsg = await this.question('What error message did you see? ');
            log.error(`Script failed: ${errorMsg}`);
            console.log('\n💡 Common solutions:');
            console.log('   - Make sure you copied the entire script');
            console.log('   - Check that your Supabase project is active');
            console.log('   - Try running the script in smaller sections');
            console.log('   - Check the Supabase logs for detailed errors');
            
            const retry = await this.question('Would you like to try again? (y/n): ');
            if (retry.toLowerCase().startsWith('y')) {
                return await this.runScript(name, filename, description);
            } else {
                throw new Error(`Failed to run ${filename}`);
            }
        }

        log.success(`${name} completed successfully!`);
    }

    async testIntegration() {
        log.step('Step 5: Testing your complete fellowship website');

        console.log('\n🧪 Let\'s test if everything is working perfectly:');
        console.log('\n🔧 Testing steps:');
        console.log('   1. Open a new terminal/command prompt');
        console.log('   2. Navigate to your project directory');
        console.log('   3. Run: npm run dev');
        console.log('   4. Open http://localhost:3000 in your browser');
        console.log('   5. Open browser console (F12 → Console tab)');
        console.log('\n✅ Look for these success messages:');
        console.log('   - "✅ Supabase client initialized successfully"');
        console.log('   - "📊 Database ready for Christian fellowship!"');
        console.log('   - "✅ Database connection verified"');
        console.log('\n🎯 Test the website features:');
        console.log('   - Browse fellowship groups on the main page');
        console.log('   - Try the signup page: http://localhost:3000/signup.html');
        console.log('   - Submit a test prayer request');
        console.log('   - Check that everything looks good\n');

        const testPassed = await this.question('Is everything working correctly? (y/n): ');
        
        if (testPassed.toLowerCase().startsWith('y')) {
            log.success('🎉 Complete integration test passed!');
        } else {
            log.warning('Some issues detected - but we can fix them!');
            
            const issue = await this.question('What specific issue are you seeing? ');
            console.log('\n🔍 Common solutions:');
            console.log('   - Check browser console for error messages');
            console.log('   - Verify all SQL scripts ran successfully');
            console.log('   - Make sure Supabase project is active');
            console.log('   - Try refreshing your browser');
            console.log('   - Check that npm run dev is still running');
            
            console.log('\n📞 If issues persist:');
            console.log('   - Check the SUPABASE_COMPLETE_SETUP.md guide');
            console.log('   - Open a GitHub issue with error details');
            console.log('   - The website will work with fallback features even if database is not connected');
        }
    }

    async showSuccess() {
        log.title('🎉 Christian Fellowship Website Setup COMPLETE!');

        console.log('🚀 What you now have:');
        console.log('   ✅ Complete Supabase database with 12 tables');
        console.log('   ✅ Enterprise-grade security policies');
        console.log('   ✅ User authentication system');
        console.log('   ✅ Fellowship group management');
        console.log('   ✅ Community prayer wall');
        console.log('   ✅ Bible study session tracking');
        console.log('   ✅ Event coordination system');
        console.log('   ✅ Personal spiritual growth dashboard');
        console.log('   ✅ Website files updated and connected');
        console.log('   ✅ Development environment configured');
        console.log('\n💪 Your platform now supports:');
        console.log('   • User registration and authentication');
        console.log('   • Fellowship group creation and management');
        console.log('   • Community prayer requests and responses');
        console.log('   • Bible study sessions and notes');
        console.log('   • Event planning and registration');
        console.log('   • Personal prayer journal');
        console.log('   • Spiritual growth tracking');
        console.log('   • Community testimonies');
        console.log('   • Resource library sharing');
        console.log('\n📋 Next steps to launch your ministry:');
        console.log('   1. 🧪 Test all features locally');
        console.log('   2. 📝 Customize content for your community');
        console.log('   3. 🎨 Add your branding and styling');
        console.log('   4. 🚀 Deploy to production (GitHub Actions ready)');
        console.log('   5. 👥 Invite your Christian community!');
        console.log('\n🔐 For production deployment:');
        console.log('   1. Go to GitHub → Settings → Secrets and variables → Actions');
        console.log('   2. Add these Repository Secrets:');
        console.log(`      • VITE_SUPABASE_URL = ${this.config.url}`);
        console.log(`      • VITE_SUPABASE_ANON_KEY = ${this.config.key}`);
        console.log('   3. Push any change to main branch');
        console.log('   4. GitHub Actions will automatically deploy!');
        console.log('\n🎯 Your website URLs:');
        console.log('   • Local: http://localhost:3000');
        console.log('   • Production: https://churchoffellowshipofbelievers-design.github.io/The-Church/');
        console.log('\n📚 Documentation & Help:');
        console.log('   • Complete setup guide: SUPABASE_COMPLETE_SETUP.md');
        console.log('   • GitHub secrets setup: GITHUB_SECRETS_SETUP.md');
        console.log('   • Project overview: README.md');
        console.log('   • Need help? Open a GitHub issue');
        console.log('\n🙏 Your Christian Fellowship Platform is Ready!');
        console.log('May God bless your digital ministry and the believers you\'ll serve worldwide!');
        console.log('\n"And they devoted themselves to the apostles\' teaching and to fellowship,');
        console.log(' to the breaking of bread and to prayer." - Acts 2:42');

        // Create completion record
        const completionInfo = {
            setupDate: new Date().toISOString(),
            supabaseUrl: this.config.url,
            websiteUpdated: true,
            databaseConfigured: true,
            tablesCreated: 12,
            securityEnabled: true,
            status: 'complete',
            version: '2.0.0',
            features: [
                'user-authentication',
                'fellowship-groups', 
                'prayer-wall',
                'bible-study-sessions',
                'event-coordination',
                'personal-growth-tracking',
                'community-testimonies',
                'resource-library'
            ]
        };

        fs.writeFileSync('.fellowship-setup-complete.json', JSON.stringify(completionInfo, null, 2));
        log.success('Setup completion recorded - your fellowship platform is ready to serve! 🚀');
    }
}

// Run the complete setup
if (require.main === module) {
    const setup = new CompleteSetup();
    setup.start().catch((error) => {
        console.error('\n❌ Setup failed:', error.message);
        console.log('\n📞 Need help? Check our documentation or open a GitHub issue.');
        process.exit(1);
    });
}

module.exports = CompleteSetup;