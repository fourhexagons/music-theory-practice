# Staging Environment Setup Guide

## 🎯 Overview

This guide walks you through setting up a complete staging environment for safe deployment testing.

**Target URLs:**
- **Production**: `https://learning.lightbath.com/practice`
- **Staging**: `https://staging.learning.lightbath.com/practice` *(preferred custom domain)*

**Important**: The staging environment is accessible via **two URLs**:
1. **Custom Domain** (Primary): `https://staging.learning.lightbath.com/practice`
2. **Firebase Default** (Backup): `https://music-theory-practice-staging.web.app/practice`

Both URLs serve **identical content** from the same Firebase hosting target. The custom domain is preferred for team use, while the Firebase URL appears in deployment logs and serves as a backup.

**Status**: ✅ **Fully Operational** - Staging environment is live and ready for testing

## Phase 1: Firebase Console Setup

### Step 1: Create Staging Site
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **music-theory-practice** project
3. Navigate to **Hosting** in the left sidebar
4. Click **"Add another site"**
5. Enter site ID: `music-theory-practice-staging`
6. Click **Create**

### Step 2: Configure Firebase Targets
Run these commands in your terminal:

```bash
# Link production site (already done)
firebase target:apply hosting production music-theory-practice

# Link staging site (do this after creating staging site above)
firebase target:apply hosting staging music-theory-practice-staging
```

## Phase 2: Namecheap DNS Configuration

### Step 1: Add CNAME Record
1. Log into **Namecheap**
2. Go to **Domain List** → **Manage** (for lightbath.com)
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Configure:
   - **Type**: CNAME Record
   - **Host**: `staging.learning`
   - **Value**: `music-theory-practice-staging.web.app`
   - **TTL**: Automatic (or 1 min for testing)

### Step 2: Connect Custom Domain in Firebase
1. In Firebase Console → **Hosting**
2. Select your **staging site** (music-theory-practice-staging)
3. Click **Add custom domain**
4. Enter: `staging.learning.lightbath.com`
5. Follow verification steps (may take 24-48 hours)

**Result**: After setup, both `staging.learning.lightbath.com` and `music-theory-practice-staging.web.app` will serve the same staging content.

## Phase 3: Deployment Commands

### Manual Deployments
```bash
# Deploy to staging (updates both URLs simultaneously)
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### Automated Deployments
- **Staging**: Push to `staging` branch
- **Production**: Push to `main` branch

## Phase 4: Testing Workflow

### Before Production Deployment:
1. **Deploy to staging**: `npm run deploy:staging`
2. **Test staging site**: `https://staging.learning.lightbath.com/practice` *(use custom domain)*
3. **Verify all functionality**:
   - Form layout on desktop/mobile
   - Service Worker behavior
   - All practice modes
   - Performance
4. **Get approval**: Confirm with team/users
5. **Deploy to production**: `npm run deploy:production`

### Emergency Hotfixes:
1. **Create hotfix branch**: `git checkout -b hotfix/description`
2. **Make minimal fix**
3. **Test on staging first**: `npm run deploy:staging`
4. **Verify fix works**
5. **Deploy to production**: `npm run deploy:production`

## Phase 5: Branch Strategy

### Recommended Git Flow:
- **main**: Production-ready code
- **staging**: Staging environment code
- **feature/***: New features
- **hotfix/***: Emergency fixes

### Typical Workflow:
1. **Feature development**: `feature/new-feature` → `staging`
2. **Staging testing**: Test on `staging.learning.lightbath.com/practice`
3. **Production release**: `staging` → `main`

## 🔧 Configuration Files

### firebase.json
```json
{
  "hosting": [
    {
      "target": "production",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{"source": "/practice", "destination": "/practice.html"}]
    },
    {
      "target": "staging",
      "public": "dist", 
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{"source": "/practice", "destination": "/practice.html"}]
    }
  ]
}
```

### package.json scripts
```json
{
  "deploy:staging": "npm run build && firebase deploy --only hosting:staging",
  "deploy:production": "npm run build && firebase deploy --only hosting:production"
}
```

## 🚨 Critical Safety Protocols

### Never Deploy Directly to Production
- **Always test on staging first**
- **Verify Service Worker behavior**
- **Test mobile responsiveness**
- **Confirm no console errors**

### Emergency Procedures
If production breaks:
1. **Immediately revert**: `git revert HEAD`
2. **Deploy revert**: `npm run deploy:production`
3. **Fix on staging**: Test fix thoroughly
4. **Re-deploy**: Only after staging verification

## 📋 Verification Checklist

Before production deployment:
- [ ] Staging site loads correctly
- [ ] Form layout works on desktop/mobile
- [ ] Service Worker updates properly
- [ ] No console errors
- [ ] All practice modes functional
- [ ] Performance acceptable
- [ ] DNS propagation complete (if domain changes)

## 🔗 Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment guide
- [URL_CONFIGURATION.md](URL_CONFIGURATION.md) - URL structure
- [GIT_WORKFLOW.md](GIT_WORKFLOW.md) - Git branching strategy

---

**This staging environment provides a safe testing ground for all changes before they reach students.** 