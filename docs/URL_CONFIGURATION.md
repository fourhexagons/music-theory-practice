# URL Configuration - Single Source of Truth

## 🚨 CRITICAL: Official Application URLs

### Development Server (`npm run dev`) - **PRIMARY FOR DEVELOPMENT**
- **Landing Page**: `http://localhost:5173/`
- **Practice App**: `http://localhost:5173/practice`
- **Use for**: Daily development, testing changes, debugging
- **Features**: Live code, hot reload, latest changes

### Production Preview (`npm run preview`) - **FOR BUILD TESTING**
- **Landing Page**: `http://localhost:4173/`
- **Practice App**: `http://localhost:4173/practice`
- **Use for**: Testing production builds, deployment verification
- **Features**: Bundled/optimized code, simulates production

### Legacy Firebase Server (`npm run serve:old`) - **FOR REFERENCE ONLY**
- **Practice App**: `http://localhost:5002/practice`
- **Use for**: Comparing with legacy system (rarely needed)
- **Features**: Old architecture, Firebase hosting simulation

## ❌ INCORRECT URLs (Never Use These)

**These URLs should NEVER be referenced in:**
- Documentation
- Tests
- Code comments
- Configuration files

### ❌ Wrong Development URLs:
- ~~`http://localhost:5173/src/index.html`~~
- ~~`http://localhost:5173/src/practice.html`~~
- ~~`http://localhost:5173/index.html`~~
- ~~`http://localhost:5173/practice.html`~~

### ❌ Wrong File Paths:
- ~~`/src/practice.html`~~
- ~~`/src/index.html`~~

## ✅ Implementation Details

### Root Level Files (Clean URL Routing)
- `/index.html` - Serves landing page content at `/`
- `/practice.html` - Serves practice app content at `/practice`

### Source Files (Development Only)
- `/src/index.html` - Actual landing page source
- `/src/practice.html` - Actual practice app source

**Key Principle**: Root files include the src files to provide clean URLs while maintaining the modular src/ architecture.

## 🔧 Maintenance Protocol

### When Updating URLs:
1. **Check this document first** - Use only the official URLs listed above
2. **Update both root and src files** if making changes
3. **Test both URLs** after any changes
4. **Update documentation consistently**

### Preventing Future Issues:
1. **Always reference clean URLs** (`/practice`, not `/src/practice.html`)
2. **Use port 5173 for development** (not 4173 unless testing builds)
3. **Update tests** to use clean URLs only
4. **Update documentation** to use clean URLs only
5. **Train team members** on correct URL usage

### Quick Reference: Which Port When?

| Task | Command | Port | URL | Purpose |
|------|---------|------|-----|---------|
| **Daily Development** | `npm run dev` | 5173 | `http://localhost:5173/practice` | Live code, hot reload |
| **Testing Builds** | `npm run preview` | 4173 | `http://localhost:4173/practice` | Production simulation |
| **Legacy Comparison** | `npm run serve:old` | 5002 | `http://localhost:5002/practice` | Old system reference |
| **Performance Testing** | `npm run dev:perf` | 5004 | `http://localhost:5004/practice` | Performance analysis |

**Default Choice: Port 5173** for 95% of development work.

## 🧪 Testing URLs

### Verification Commands:
```bash
# Test development URLs
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/practice

# Expected: Both should return 200
```

### Automated Environment Verification:
```bash
npm run verify-dev-env
# Verifies server compliance, port status, and URL accessibility
# Used by the cognitive interrupt protocol for assistants
```

### Automated Test:
```bash
npm run test:headless
# Should show: "Successfully loaded app at http://localhost:5173/practice"
```

## 📚 Related Documentation

- [README.md](../README.md) - Development commands and URLs
- [HEADLESS_TEST_RESEARCH_FINDINGS.md](HEADLESS_TEST_RESEARCH_FINDINGS.md) - Test URL configuration
- [test_headless_learning_path.js](../test_headless_learning_path.js) - Automated testing

---

**This document is the definitive source for URL configuration. When in doubt, reference this file.** 