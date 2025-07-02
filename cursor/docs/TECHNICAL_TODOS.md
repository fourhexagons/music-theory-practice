# Technical To-Dos & Infrastructure Issues

## 🎯 NEW ASSISTANT HANDOFF

**CONTEXT**: Music theory practice app deployment issue resolved. Live site operational.

**CURRENT STATUS**:
✅ Live site: https://learning.lightbath.com/practice (fully functional)
✅ Local dev: npm run dev → http://localhost:5173/practice 
✅ Manual deployment: firebase deploy --only hosting (authenticated & working)
❌ GitHub Actions: Auto-deployment broken (service account authentication)
✅ Git state: Clean, main branch, all changes committed

**RECENT MAJOR WORK COMPLETED**:
- Fixed live site 404 (was GitHub Actions deployment failure)
- Pedagogical enhancement: Level 10 "Naming Triads", Level 11 "Spelling Sevenths" 
- Documentation cleanup: Removed version number references
- Architecture: New modular src/ system successfully deployed

**NEXT TASK**: GitHub Actions investigation per details below

**CRITICAL PROTOCOLS**:
1. READ ALL DOCS: Must follow docs/SYSTEMATIC_RESEARCH_METHODOLOGY.md
2. VERIFY ENVIRONMENT: npm run verify-dev-env (should pass)
3. VERIFY GIT: npm run git:verify (should show clean state)
4. NO ASSUMPTIONS: Evidence-based investigation only

**KEY FILES TO READ FIRST**:
- docs/SYSTEMATIC_RESEARCH_METHODOLOGY.md (mandatory protocols)
- docs/URL_CONFIGURATION.md (development setup)
- .github/workflows/firebase-hosting-merge.yml (broken workflow)

**WORKING COMMANDS**:
- npm run dev (development server, port 5173)
- firebase deploy --only hosting (manual deployment)
- npm run build (production build - works perfectly)

**MEMORY CONTEXT**: Assistant has detailed memories of recent deployment resolution (#1931098) and development protocols. Site architecture migrated from public/ to src/ system successfully.

**IMMEDIATE START**: Follow systematic research methodology for GitHub Actions investigation detailed below.

---

This file tracks technical debt, infrastructure improvements, and development tooling issues that need attention but are not blocking core functionality.

## 🚨 Active Issues

### GitHub Actions Deployment Pipeline 
**Status**: Manual workaround in place  
**Priority**: Medium  
**Description**: GitHub Actions automatic deployment to Firebase hosting is failing due to service account authentication issues.

**Current Situation**:
- ✅ **Live site working**: Manual deployment successful via `firebase deploy --only hosting`
- ❌ **GitHub Actions failing**: Service account secret `FIREBASE_SERVICE_ACCOUNT_MUSIC_THEORY_PRACTICE_01` appears invalid/missing
- ✅ **Workaround available**: Manual deployment works reliably

**Root Cause**:
- GitHub Actions workflow references service account secret that may be missing from repository secrets
- Previous deployments were failing silently, causing 404s on live site
- Build process was fixed (file existence checks added) but authentication remains broken

**Investigation Needed**:
1. Check GitHub repository Settings → Secrets and variables → Actions
2. Verify `FIREBASE_SERVICE_ACCOUNT_MUSIC_THEORY_PRACTICE_01` exists and is valid
3. If missing/invalid, generate new Firebase service account key:
   ```bash
   firebase login
   firebase projects:list
   firebase projects:use music-theory-practice-01
   # Generate new service account and add to GitHub secrets
   ```

**Files Involved**:
- `.github/workflows/firebase-hosting-merge.yml`
- `.github/workflows/firebase-hosting-pull-request.yml`
- `firebase.json` (deployment config)
- `package.json` (build process)

**Resolution Timeline**: When convenient - not blocking development

---

## 📋 Future Technical Improvements

### Package.json Cleanup
**Status**: Identified  
**Priority**: Low  
**Description**: Remove unused scripts and fix broken script references in package.json

**Details**:
- Several scripts reference non-existent files (analyze-css.js, analyze-performance.js, profile-build.js)
- `phase2:complete` script may be obsolete
- General cleanup needed for maintainability

---

## 🔄 Completed Items

### Live Site 404 Resolution
**Completed**: July 2, 2025  
**Issue**: Live site returning 404 for all routes  
**Root Cause**: GitHub Actions build failure + deployment pipeline issues  
**Solution**: Manual Firebase deployment + build process fixes  
**Result**: Site fully functional with all recent improvements live

### Documentation Version References
**Completed**: July 2, 2025  
**Issue**: Hard-coded version numbers in documentation creating maintenance burden  
**Solution**: Removed version references from all docs files  
**Result**: Cleaner, more maintainable documentation

---

## 📝 Notes

- **Deployment Strategy**: Manual deployment (`firebase deploy --only hosting`) is reliable and fast
- **Development Workflow**: Unaffected - `npm run dev` continues to work perfectly
- **Git Protocol**: All commits properly tracked and pushed to main branch
- **Build Process**: Enhanced with file existence checks for CI compatibility

---

*Last Updated: July 2, 2025* 