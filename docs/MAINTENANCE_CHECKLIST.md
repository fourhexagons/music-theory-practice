# Documentation Maintenance Checklist

## 🚨 Pre-Commit Documentation Check

**Before committing ANY changes, run through this checklist:**

### 1. Version Numbers
- [ ] Script versions updated in `practice.html` (?v=15)
- [ ] Version number updated in `DEVELOPMENT_STATUS.md`
- [ ] Version number updated in code headers
- [ ] Version number updated in this checklist

### 2. Development Status
- [ ] `DEVELOPMENT_STATUS.md` reflects current state
- [ ] Recent fixes section is updated
- [ ] Architecture overview is current
- [ ] Next steps section is updated

### 3. Debugging Guide
- [ ] `docs/DEBUGGING_GUIDE.md` includes new debugging patterns
- [ ] New common issues are documented
- [ ] Console debugging commands are current
- [ ] Testing checklist is updated

### 4. Onboarding Guide
- [ ] `docs/ASSISTANT_ONBOARDING.md` has current version
- [ ] Architecture overview is accurate
- [ ] Common issues section is current
- [ ] Pre-development checklist is updated

### 5. Code Headers
- [ ] `public/js/main.js` header shows current status
- [ ] `public/js/state/learningState.js` header is current
- [ ] Recent fixes are documented in headers
- [ ] Dependencies are accurately listed

### 6. Commit Message
- [ ] Commit message references documentation updates
- [ ] Version number is mentioned
- [ ] Changes are clearly described

## 📋 Quick Commands

### Check Current Versions
```bash
# Check script versions in practice.html
grep -n "v=" public/practice.html

# Check version in development status
grep -n "Version:" DEVELOPMENT_STATUS.md

# Check version in code headers
grep -n "CURRENT STATUS" public/js/main.js
grep -n "CURRENT STATUS" public/js/state/learningState.js
```

### Update All Versions (Manual)
```bash
# Update script versions
sed -i '' 's/v=14/v=15/g' public/practice.html

# Update development status (manual edit)
# Update code headers (manual edit)
```

## 🎯 Documentation Update Triggers

**Update documentation when you:**
- Fix a bug that reveals new patterns
- Add new features that change architecture
- Discover new debugging techniques
- Change development workflow
- Update version numbers
- Add new dependencies
- Encounter new error messages
- Find better debugging commands

## 📝 Example Complete Update

```bash
# 1. Make your code changes
# 2. Update documentation files
# 3. Run maintenance checklist
# 4. Commit with documentation

git add .
git commit -m "Fix [issue] and update documentation to v15

- Fix [specific issue description]
- Update DEVELOPMENT_STATUS.md to v15
- Add new debugging pattern to DEBUGGING_GUIDE.md
- Update ASSISTANT_ONBOARDING.md with current architecture
- Update code headers with current status
- Update script versions to v15"
```

## 🚀 Quick Documentation Audit

**Run this audit weekly:**

1. **Check version consistency** across all files
2. **Verify debugging commands** still work
3. **Test onboarding process** with fresh assistant
4. **Review recent commits** for documentation updates
5. **Update any outdated information**

---

**Current Version**: v14  
**Last Updated**: June 27, 2025  
**Next Review**: Weekly 