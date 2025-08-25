# 🔐 GitHub Secrets Setup for Fellowship Website

This guide explains how to configure GitHub Secrets for secure deployment of your Christian Fellowship Website with Supabase and API integrations.

## 🎯 **Why GitHub Secrets?**

GitHub Secrets allow you to:
- **Securely store** API keys and database credentials
- **Deploy automatically** without exposing sensitive data
- **Separate environments** (development vs production)
- **Share repositories** without compromising security

## 🔑 **Required Secrets**

You need to add these secrets to your GitHub repository:

### **Database Secrets**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### **API Secrets**
```
BIBLE_API_KEY=your_scripture_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

### **Optional Deployment Secrets**
```
VITE_SITE_URL=https://your-domain.com
NODE_ENV=production
```

## 🚀 **Step-by-Step Setup**

### **1. Go to Repository Settings**

1. **Navigate to your GitHub repository**
2. **Click Settings** (in the repository, not your profile)
3. **Sidebar: Secrets and variables** → **Actions**

### **2. Add Repository Secrets**

For each secret, click **New repository secret**:

#### **VITE_SUPABASE_URL**
- **Name**: `VITE_SUPABASE_URL`
- **Secret**: `https://your-project-id.supabase.co`
- **Source**: Supabase Dashboard → Settings → API

#### **VITE_SUPABASE_ANON_KEY**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Secret**: Your Supabase anon public key (starts with `eyJ0eXAi...`)
- **Source**: Supabase Dashboard → Settings → API
- **Note**: This is the "anon" key, not the service role key

#### **BIBLE_API_KEY**
- **Name**: `BIBLE_API_KEY`
- **Secret**: Your Scripture API key
- **Source**: [scripture.api.bible](https://scripture.api.bible) dashboard

#### **FIRECRAWL_API_KEY**
- **Name**: `FIRECRAWL_API_KEY`
- **Secret**: Your Firecrawl API key
- **Source**: [firecrawl.dev](https://firecrawl.dev) dashboard

### **3. Verify Secrets are Added**

After adding all secrets, you should see:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ BIBLE_API_KEY
- ✅ FIRECRAWL_API_KEY

## 🔄 **How Secrets Work in Deployment**

### **GitHub Actions Workflow**

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

1. **Reads secrets** from GitHub repository settings
2. **Creates environment file** for production build
3. **Builds project** with all API integrations
4. **Deploys to GitHub Pages** with full functionality

### **Security Features**

- ✅ **Secrets are encrypted** at rest in GitHub
- ✅ **Only accessible** during workflow execution
- ✅ **Not visible** in logs or pull requests from forks
- ✅ **Separate from source code** - never committed

## 🌍 **Environment Management**

### **Development vs Production**

**Development** (local):
- Uses `.env.local` file (not committed)
- Can use development Supabase project
- API keys for testing

**Production** (deployed):
- Uses GitHub Secrets
- Production Supabase project
- Production API keys with higher limits

### **Best Practices**

1. **Separate Projects**: Use different Supabase projects for dev/prod
2. **Different API Keys**: Use separate API keys for testing
3. **Regular Rotation**: Update secrets periodically
4. **Monitor Usage**: Track API usage in dashboards

## 🔍 **Testing Secrets Setup**

### **1. Trigger Deployment**

Push a change to the main branch:
```bash
git add .
git commit -m "Test deployment with secrets"
git push origin main
```

### **2. Check GitHub Actions**

1. **Go to Actions tab** in your repository
2. **Click on the latest workflow run**
3. **Check build logs** for:
   - ✅ Environment variables loaded
   - ✅ Build completed successfully
   - ✅ Deployment successful

### **3. Verify Live Site**

1. **Visit your GitHub Pages URL**:
   `https://churchoffellowshipofbelievers-design.github.io/The-Church/`

2. **Check browser console** for:
   - ✅ Supabase client initialized
   - ✅ API connections working
   - ✅ No "undefined" environment variables

### **4. Test Functionality**

- ✅ **User registration** works (Supabase connection)
- ✅ **Bible search** works (Scripture API)
- ✅ **Daily verses** load (Bible API)
- ✅ **Prayer requests** can be submitted

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"Supabase client not initialized"**
   - Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   - Verify secret names exactly match workflow file

2. **"API key invalid"**
   - Verify API keys are correct and active
   - Check for extra spaces or characters

3. **"Deployment failed"**
   - Check GitHub Actions logs
   - Verify all required secrets are set
   - Check for typos in secret names

### **Debug Steps**

1. **Check workflow logs** for environment variable loading
2. **Verify secret names** match exactly
3. **Test API keys** separately in Postman/curl
4. **Check Supabase project** is active and accessible

## 🔐 **Security Considerations**

### **What Secrets Include**

- ✅ **VITE_SUPABASE_ANON_KEY**: Safe for frontend (read-only access with RLS)
- ❌ **Service Role Key**: NEVER put in GitHub Secrets for frontend deployment
- ✅ **API Keys**: Generally safe for client-side use with rate limits

### **Additional Security**

1. **Supabase RLS**: Ensure Row Level Security is enabled
2. **API Limits**: Monitor and set appropriate rate limits
3. **Regular Audits**: Check secret usage and rotate keys
4. **Team Access**: Limit who can edit repository secrets

## 📊 **Monitoring Secrets Usage**

### **Supabase Dashboard**
- **API Requests**: Monitor database calls
- **Auth Activity**: Track user registrations
- **Usage Metrics**: Check bandwidth and storage

### **API Dashboards**
- **Scripture API**: Monitor request count and limits
- **Firecrawl API**: Track scraping usage
- **Rate Limits**: Ensure you stay within quotas

## 🔄 **Updating Secrets**

### **When to Update**
- **API key rotation** (recommended quarterly)
- **Supabase project changes**
- **Security incidents**
- **Environment changes**

### **How to Update**
1. **Go to repository Settings** → **Secrets and variables** → **Actions**
2. **Click on secret name**
3. **Update secret** with new value
4. **Deployment will use new secret** on next push

## ✅ **Verification Checklist**

Before deploying to production:

- [ ] **Supabase project created** and configured
- [ ] **Database schema** set up with RLS
- [ ] **API keys obtained** from all services
- [ ] **GitHub Secrets added** with correct names
- [ ] **Local development** working with .env.local
- [ ] **GitHub Actions workflow** completing successfully
- [ ] **Live site** functional with all features
- [ ] **User registration** working end-to-end

## 🎯 **Next Steps**

Once secrets are configured:

1. **Connect to Vercel** (optional) - will automatically use same secrets
2. **Set up monitoring** for API usage and errors
3. **Configure custom domain** (if desired)
4. **Set up backup strategy** for database
5. **Plan for scaling** as community grows

---

## 🙏 **Fellowship Impact**

With proper secrets management, your Christian fellowship website will have:

- **Secure user data** protected by Supabase RLS
- **Reliable API integrations** for rich content
- **Automatic deployments** for easy updates
- **Scalable infrastructure** for growing community
- **Professional security standards** for peace of mind

Your digital fellowship platform is now ready to serve believers worldwide with enterprise-grade security! 🚀

*"Above all else, guard your heart, for everything you do flows from it." - Proverbs 4:23*

---

**Need help?** Check the [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) or open an issue in the repository.