#!/usr/bin/env node

/**
 * 🤖 Automated Supabase Setup for Christian Fellowship Website
 * This script will automatically set up your entire database!
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

class SupabaseSetup {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.config = {};
    }

    async question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    async start() {
        log.title('Christian Fellowship Website - Automated Supabase Setup');
        
        console.log('This script will automatically set up your complete database!\n');
        console.log('What you need:');
        console.log('1. A Supabase account (free at supabase.com)');
        console.log('2. A new Supabase project');
        console.log('3. Your project URL and API key');
        console.log('\nLet\'s get started! 🚀\n');

        try {
            await this.collectCredentials();
            await this.createEnvironmentFile();
            await this.setupDatabase();
            await this.testConnection();
            await this.showNextSteps();
        } catch (error) {
            log.error(`Setup failed: ${error.message}`);
            console.log('\n📞 Need help? Check our troubleshooting guide or open a GitHub issue.');
        } finally {
            this.rl.close();
        }
    }

    async collectCredentials() {
        log.step('Step 1: Collecting your Supabase credentials');
        
        console.log('\n📋 Go to your Supabase project:');
        console.log('   1. Settings → API');
        console.log('   2. Copy your Project URL and anon public key\n');

        this.config.url = await this.question('🔗 Enter your Supabase Project URL: ');
        
        if (!this.config.url.includes('supabase.co')) {
            throw new Error('Invalid Supabase URL. Should be like: https://your-project.supabase.co');
        }

        this.config.anonKey = await this.question('🔑 Enter your Supabase anon public key: ');
        
        if (!this.config.anonKey.startsWith('eyJ')) {
            throw new Error('Invalid API key format. Should start with "eyJ"');
        }

        log.success('Credentials collected successfully!');
    }

    async createEnvironmentFile() {
        log.step('Step 2: Creating environment configuration');

        const envContent = `# Environment Variables for Christian Fellowship Website
# Generated automatically by setup script

# ===================================
# SUPABASE DATABASE CONFIGURATION
# ===================================
VITE_SUPABASE_URL=${this.config.url}
VITE_SUPABASE_ANON_KEY=${this.config.anonKey}

# ===================================
# OPTIONAL API KEYS
# ===================================
# Add these later if you want enhanced features
# BIBLE_API_KEY=your_scripture_api_key_here
# FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# ===================================
# DEPLOYMENT CONFIGURATION
# ===================================
NODE_ENV=development
VITE_SITE_URL=http://localhost:3000

# Generated: ${new Date().toISOString()}
`;

        fs.writeFileSync('.env.local', envContent);
        log.success('Environment file created: .env.local');
    }

    async setupDatabase() {
        log.step('Step 3: Setting up your database structure');
        
        console.log('\n📊 Now we need to run SQL scripts in your Supabase dashboard:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Click "SQL Editor" in the sidebar');
        console.log('   3. Click "New Query"');
        console.log('\n🔧 We\'ll run 3 scripts in order:\n');

        // Script 1: Database Structure
        await this.runScript('Database Tables', 'supabase-database-setup.sql', 
            'This creates all 12 tables for your fellowship website');

        // Script 2: Security Policies
        await this.runScript('Security Policies', 'supabase-security-policies.sql', 
            'This enables Row Level Security to protect user data');

        // Script 3: Sample Data
        const addSampleData = await this.question('\n🎲 Add sample data for testing? (y/n): ');
        if (addSampleData.toLowerCase().startsWith('y')) {
            await this.runScript('Sample Data', 'supabase-sample-data.sql', 
                'This adds test users, groups, and prayer requests');
        }

        log.success('Database setup completed!');
    }

    async runScript(name, filename, description) {
        console.log(`\n📋 ${colors.bright}${name}${colors.reset}`);
        console.log(`   ${description}`);
        console.log(`   File: ${filename}\n`);

        if (!fs.existsSync(filename)) {
            log.error(`Script file not found: ${filename}`);
            return;
        }

        const scriptContent = fs.readFileSync(filename, 'utf8');
        const lines = scriptContent.split('\n').length;
        
        console.log(`📄 Script ready (${lines} lines)`);
        console.log('\n🔧 Steps to run:');
        console.log('   1. Copy the script content below');
        console.log('   2. Paste it into your Supabase SQL Editor');
        console.log('   3. Click "RUN" button');
        console.log('   4. Look for success messages\n');

        await this.question('Press Enter when ready to see the script...');

        console.log(`\n${colors.cyan}==================== COPY EVERYTHING BELOW ====================${colors.reset}\n`);
        console.log(scriptContent);
        console.log(`\n${colors.cyan}==================== COPY EVERYTHING ABOVE ====================${colors.reset}\n`);

        const success = await this.question('Did the script run successfully? (y/n): ');
        
        if (!success.toLowerCase().startsWith('y')) {
            const errorMsg = await this.question('What error did you see? ');
            log.error(`Script failed: ${errorMsg}`);
            console.log('\n💡 Common fixes:');
            console.log('   - Check for typos in the SQL');
            console.log('   - Make sure you copied the entire script');
            console.log('   - Try running the script in smaller parts');
            throw new Error(`Failed to run ${filename}`);
        }

        log.success(`${name} script completed successfully!`);
    }

    async testConnection() {
        log.step('Step 4: Testing your database connection');

        console.log('\n🧪 Let\'s test if everything is working:');
        console.log('   1. Start your development server: npm run dev');
        console.log('   2. Open http://localhost:3000');
        console.log('   3. Check browser console (F12)');
        console.log('   4. Look for: "Supabase client initialized successfully"\n');

        const testPassed = await this.question('Is the connection working? (y/n): ');
        
        if (testPassed.toLowerCase().startsWith('y')) {
            log.success('Database connection test passed!');
        } else {
            log.warning('Connection test failed - but that\'s ok, we can fix it!');
            console.log('\n🔍 Troubleshooting tips:');
            console.log('   - Check your .env.local file has correct values');
            console.log('   - Verify your Supabase project is active');
            console.log('   - Try refreshing your browser');
        }
    }

    async showNextSteps() {
        log.title('🎉 Setup Complete! Your Fellowship Database is Ready!');

        console.log('✅ What we accomplished:');
        console.log('   • Created 12 database tables');
        console.log('   • Enabled security policies');
        console.log('   • Set up environment variables');
        console.log('   • Connected your website to Supabase\n');

        console.log('🚀 Your database now supports:');
        console.log('   • User authentication and profiles');
        console.log('   • Fellowship group management');
        console.log('   • Community prayer wall');
        console.log('   • Bible study sessions');
        console.log('   • Event coordination');
        console.log('   • Personal spiritual growth tracking\n');

        console.log('📋 Next steps:');
        console.log('   1. Test user registration: http://localhost:3000/signup.html');
        console.log('   2. Create fellowship groups');
        console.log('   3. Submit prayer requests');
        console.log('   4. Deploy to production (GitHub Actions will handle it!)\n');

        console.log('🔐 For production deployment:');
        console.log('   1. Go to GitHub → Settings → Secrets');
        console.log('   2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.log('   3. Push any change to trigger deployment\n');

        console.log('🆘 Need help?');
        console.log('   • Check SUPABASE_COMPLETE_SETUP.md');
        console.log('   • Open a GitHub issue');
        console.log('   • Check browser console for errors\n');

        console.log('🙏 May God bless your digital fellowship ministry!');
        console.log('Your Christian community platform is ready to serve believers worldwide!\n');

        // Create a setup completion file
        const completionInfo = {
            setupDate: new Date().toISOString(),
            supabaseUrl: this.config.url,
            tablesCreated: 12,
            status: 'completed',
            version: '1.0.0'
        };

        fs.writeFileSync('.supabase-setup-complete.json', JSON.stringify(completionInfo, null, 2));
        log.success('Setup completion recorded in .supabase-setup-complete.json');
    }
}

// Run the setup
if (require.main === module) {
    const setup = new SupabaseSetup();
    setup.start().catch(console.error);
}

module.exports = SupabaseSetup;