# Deployment Guide for AI Assistants

## 🔍 **Built on Systematic Research Methodology**

This guide follows the [Systematic Research Methodology](SYSTEMATIC_RESEARCH_METHODOLOGY.md) and consolidates all deployment information scattered across multiple files into one authoritative source.

---

## 🚨 **CRITICAL: Deployment Protection Protocol**

### **🛑 MANDATORY STAGING-FIRST DEPLOYMENT PROTOCOL**

**ASSISTANTS MUST FOLLOW THIS EXACT SEQUENCE - NO EXCEPTIONS:**

1. **Deploy to staging FIRST**: `npm run deploy:staging`
2. **Inform user**: "I've deployed to staging: https://staging.learning.lightbath.com/practice"
3. **Wait for manual testing**: User will test the staging site themselves
4. **Ask for explicit permission**: "Should I deploy this to production?"
5. **Only deploy to production after receiving explicit approval**: "yes", "deploy", or "proceed"

### **🚨 ABSOLUTE PROHIBITIONS:**
- **NEVER deploy directly to production** without staging first
- **NEVER deploy to production** without explicit user approval after staging test
- **NEVER assume** staging test was successful - wait for user confirmation
- **NEVER proceed** with production deployment if user says "let me test" or "wait"

### **⚠️ CRITICAL FAILURE WARNING:**
**ANY deployment to production without following this exact protocol is a CRITICAL FAILURE. The user has been burned multiple times by hasty deployments that broke the live site.**

---

## 📋 **Complete Deployment Process**

### **Current Working Method (Recommended)**

#### **1. Build for Production**
```bash
npm run build
```

**What This Does:**
- Builds using Vite with production optimizations
- Creates `dist/` directory with bundled assets
- Generates hashed filenames for cache-busting (e.g., `practice.Cxh6_bIJ.js`)
- Copies essential files from `public-clean/` (favicon, icons, images)
- Creates clean URLs by copying `dist/src/practice.html` to `dist/practice.html`
- Includes file existence checks to prevent deployment failures

#### **2. Manual Deployment (Current Reliable Method)**
```bash
firebase deploy --only hosting
```

**What This Does:**
- Deploys `dist/` directory to Firebase hosting
- Updates live site at `https://music-theory-practice-01.web.app`
- Updates custom domain at `https://learning.lightbath.com`
- Includes service worker with clean asset caching (no legacy conflicts)

#### **3. Verification**
**Live Site URLs:**
- **Main Practice App**: `https://learning.lightbath.com/practice`
- **Landing Page**: `https://learning.lightbath.com/`
- **Firebase URL**: `https://music-theory-practice-01.web.app/practice`

---

## 🏗️ **Build Process Details**

### **Current Architecture (Post-Fix)**
- **Source**: `src/` directory (modern modular system)
- **Build Output**: `dist/` directory
- **Static Assets**: `public-clean/` directory (clean, essential files only)
- **Service Worker**: Vite PWA plugin generates optimized caching

### **Key Build Process Changes (Recent Fix)**
1. **Clean Public Directory**: Uses `public-clean/` instead of `public/`
2. **No Legacy Conflicts**: Eliminates old files that caused service worker conflicts
3. **Optimized Caching**: Service worker caches ~34 entries instead of 57
4. **Asset Hashing**: Proper cache-busting with hashed filenames

### **Service Worker Behavior (Fixed)**
- **Before Fix**: Cached 57 entries (501.88 KiB) including legacy conflicts
- **After Fix**: Caches 34 entries (317.40 KiB) with clean modern assets only
- **Result**: No more 404 errors for missing assets

---

## 🔧 **Build Configuration**

### **Vite Configuration (`vite.config.js`)**
```javascript
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // ... other build settings
  },
  publicDir: 'public-clean', // Clean static assets only
  // ... PWA and other plugins
})
```

### **Firebase Configuration (`firebase.json`)**
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "/practice",
        "destination": "/practice.html"
      }
    ]
  }
}
```

### **Package.json Build Script**
```json
{
  "build": "vite build && test -f dist/src/index.html && test -f dist/src/practice.html && cp dist/src/index.html dist/index.html && cp dist/src/practice.html dist/practice.html"
}
```

---

## 🚨 **GitHub Actions Deployment Status**

### **Current Status: Manual Deployment Preferred**
- **✅ Manual Deployment**: Working reliably (`firebase deploy --only hosting`)
- **❌ GitHub Actions**: Service account authentication issues
- **✅ Build Process**: Fully compatible with CI/CD (includes file existence checks)

### **GitHub Actions Configuration**
**Files:**
- `.github/workflows/firebase-hosting-merge.yml`
- `.github/workflows/firebase-hosting-pull-request.yml`

**Known Issue:**
- Service account secret `FIREBASE_SERVICE_ACCOUNT_MUSIC_THEORY_PRACTICE_01` needs verification
- Node.js 20 compatibility confirmed (previously fixed)

**Resolution Path** (when needed):
1. Check GitHub repository Settings → Secrets and variables → Actions
2. Verify service account secret exists and is valid
3. If missing, generate new Firebase service account key
4. Test with a small deployment

---

## 🔍 **Deployment Troubleshooting Guide**

### **Common Issues and Solutions**

#### **1. Service Worker Cache Conflicts**
**Symptoms:**
- 404 errors for JavaScript assets with specific hashes
- Old cached content serving instead of new deployment
- Mobile browsers showing different content than desktop

**Root Cause:**
- Mixed legacy and modern build artifacts
- Service worker caching old files

**Solution:**
- **Fixed**: Using `public-clean/` directory eliminates legacy conflicts
- **Verification**: Check service worker cache size (~34 entries is correct)

#### **2. Asset 404 Errors**
**Symptoms:**
- Missing JavaScript files like `practice.BXPz9h1l.js`
- Console errors on live site

**Root Cause:**
- Build/deployment mismatch
- Service worker serving outdated asset references

**Solution:**
- **Fixed**: Clean build process with proper asset hashing
- **Verification**: Check `dist/assets/` contains correctly hashed files

#### **3. Favicon/Logo Missing**
**Symptoms:**
- Favicon 404 errors in dev environment
- Logo images not loading

**Root Cause:**
- Static assets not properly included in build

**Solution:**
- **Fixed**: `public-clean/` directory includes essential static files
- **Verification**: Check `dist/favicon.ico` and `dist/images/` exist

#### **4. Mobile Browser Caching**
**Symptoms:**
- Desktop works after hard refresh, mobile doesn't
- Private/incognito mode works, regular browsing doesn't

**Root Cause:**
- Aggressive service worker caching on mobile
- Old cached assets still being served

**Solution:**
- **Fixed**: Clean service worker with proper cache versioning
- **User Action**: Clear browser cache or use private browsing temporarily

---

## 📊 **Deployment Verification Checklist**

### **Pre-Deployment Verification**
- [ ] `npm run build` completes successfully
- [ ] `dist/` directory contains expected files
- [ ] Service worker cache entries are clean (~34 entries)
- [ ] No legacy files mixed with modern assets
- [ ] Asset hashes are current/unique

### **Post-Deployment Verification**
- [ ] Live site loads without console errors
- [ ] Practice app functions correctly at `/practice`
- [ ] No 404 errors for JavaScript/CSS assets
- [ ] Favicon and logo images load properly
- [ ] Service worker operates correctly (check DevTools → Application → Service Workers)

### **Cross-Browser Testing**
- [ ] Desktop Chrome (hard refresh)
- [ ] Desktop Safari/Firefox
- [ ] Mobile Chrome (may need cache clearing)
- [ ] Mobile Safari
- [ ] Private/incognito mode verification

---

## 🎯 **Development vs. Production vs. Staging URLs**

### **Development (Local)**
- **Primary**: `http://localhost:5173/practice`
- **Preview**: `http://localhost:4173/practice` (after `npm run preview`)

### **Staging (Pre-Production Testing)**
- **Primary**: `https://staging.learning.lightbath.com/practice`
- **Firebase**: `https://music-theory-practice-staging.web.app/practice`

### **Production (Live)**
- **Primary**: `https://learning.lightbath.com/practice`
- **Firebase**: `https://music-theory-practice-01.web.app/practice`

**⚠️ Critical**: Always use clean URLs (no `/src/` or `.html` extensions) in documentation and tests.

---

## 📚 **Related Documentation**

- **[URL Configuration](URL_CONFIGURATION.md)** - Official app URLs
- **[Staging Setup](STAGING_SETUP.md)** - Complete staging environment setup and configuration
- **[Development Guide](DEVELOPMENT.md)** - Local development setup
- **[Git Workflow](GIT_WORKFLOW.md)** - Deploy-from-main safety protocols
- **[Release Format](RELEASE_FORMAT.md)** - Release documentation standards

---

## 🔄 **Deployment History & Lessons Learned**

### **Recent Major Fix (Current)**
**Issue**: Service worker cache conflicts causing 404 errors
**Root Cause**: Mixed legacy and modern build artifacts
**Solution**: Clean build process with `public-clean/` directory
**Result**: Reliable deployment with optimized caching

### **Previous Issues (Resolved)**
1. **GitHub Actions Node.js compatibility** → Fixed with Node.js 20
2. **Service account authentication** → Manual deployment as reliable workaround
3. **Legacy file pollution** → Fixed with clean build process

### **Key Lessons**
1. **Clean builds prevent cache conflicts** - Separate legacy and modern assets
2. **Manual deployment is reliable** - Firebase CLI deployment works consistently
3. **Service worker optimization matters** - Fewer, cleaner cache entries perform better
4. **Asset hashing prevents cache issues** - Vite's automatic hashing is essential

---

## ✅ **Quick Reference Commands**

### **Standard Deployment Workflow**

#### **MANDATORY: Staging-First Deployment**
```bash
# 1. Build for production
npm run build

# 2. Deploy to staging FIRST (mandatory)
npm run deploy:staging

# 3. Inform user and wait for manual testing
# "I've deployed to staging: https://staging.learning.lightbath.com/practice"

# 4. Ask for explicit permission after user tests
# "Should I deploy this to production?"

# 5. Deploy to production ONLY after explicit approval
npm run deploy:production
```

#### **Emergency Revert (Production Issues)**
```bash
# 1. Immediately revert code
git revert HEAD

# 2. Deploy revert to production
npm run deploy:production

# 3. Fix issue on staging first
npm run deploy:staging
# Test thoroughly, get approval, then deploy to production
```

#### **For Staging-Only Testing**
```bash
# 1. Build for production
npm run build

# 2. Deploy to staging
npm run deploy:staging

# 3. Test on staging
# Visit https://staging.learning.lightbath.com/practice
```

### **Troubleshooting Commands**
```bash
# Check build output
ls -la dist/
ls -la dist/assets/

# Check service worker
# (DevTools → Application → Service Workers)

# Clean development environment
npm run dev
```

---

**Remember: Follow the mandatory staging-first deployment protocol. Always deploy to staging first, wait for user testing and explicit approval before deploying to production.**
