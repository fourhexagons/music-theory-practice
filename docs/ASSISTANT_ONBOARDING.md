# Assistant Onboarding Guide - Music Theory Practice App

## 🚨 CRITICAL: Follow This Order Exactly

**Before making ANY changes or suggestions, you MUST read these files in this specific order:**

### Step 1: Read Current Status (5 minutes)
**File**: `DEVELOPMENT_STATUS.md`
- **Purpose**: Understand current state, recent fixes, and architecture
- **Key Points to Note**:
  - Current version (v14) and what was recently fixed
  - File dependencies and loading order
  - Known debugging patterns
  - Recent changes summary

### Step 2: Read Debugging Guide (3 minutes)
**File**: `docs/DEBUGGING_GUIDE.md`
- **Purpose**: Learn systematic debugging approach and common issues
- **Key Points to Note**:
  - Emergency quick fixes for common problems
  - Console debugging commands
  - Testing checklist
  - When to use fallback initialization

### Step 3: Read Code Headers (2 minutes)
**Files**: 
- `public/js/main.js` (header comments only)
- `public/js/state/learningState.js` (header comments only)
- **Purpose**: Understand current implementation and dependencies
- **Key Points to Note**:
  - Recent fixes and their implementation
  - State structure and persistence patterns
  - Common issues and debugging notes

### Step 4: Quick Context Summary (2 minutes)

**Current Version**: v14  
**Server Protocol**: Always use `./serve-clean.sh` (never `firebase serve` directly)  
**Local URL**: http://localhost:5002 (check terminal output for actual port)  
**Main Files**: `main.js`, `learningState.js`, `quizData.js`, `normalization.js`

**Architecture Overview**:
- **State Management**: `learningState.js` handles persistence and restoration
- **Data**: `quizData.js` provides MODES, CHAPTERS, and chord data
- **Validation**: `normalization.js` handles accidental normalization (ASCII ↔ Unicode)
- **UI**: `main.js` orchestrates everything and handles user interactions

**Essential Debugging Commands**:
```javascript
// Check if everything loaded
console.log('quizData:', !!window.quizData);
console.log('learningState:', !!window.learningState);
console.log('MODES:', window.MODES);

// Check current state
console.log('Current state:', window.learningState);
console.log('Current question:', window.learningState.currentQuestion);
```

## 🚨 Common Issues & Quick Fixes

### Issue: "window.MODES is undefined"
**Solution**: Check script loading order, update version numbers (?v=15)

### Issue: State not persisting after refresh
**Solution**: Ensure `saveLearningState()` is called after state changes

### Issue: Correct answers marked incorrect
**Solution**: Check normalization with `accidentalToUnicode()` for both input and expected

### Issue: Blank page on load
**Solution**: Update script versions, check console for errors, use fallback initialization

## 🛠️ Development Workflow

### Local Development
```bash
# Start server (re-auth if needed)
firebase serve --only hosting

# If authentication fails
firebase login --reauth
```

### Testing Protocol
1. **Normal load**: Check if page loads without errors
2. **Hard refresh**: Cmd+Shift+R to test state persistence
3. **Advanced mode**: Test if advanced practice persists across refreshes
4. **Validation**: Test chord spelling with both ASCII and Unicode accidentals

### Making Changes
1. **Update version numbers** when modifying scripts (?v=15)
2. **Test on hard refresh** to catch state issues
3. **Check console** for "undefined" errors first
4. **Follow debugging guide** for systematic problem-solving

## 📋 Pre-Development Checklist

Before starting any development work, verify:

- [ ] Page loads correctly at `http://localhost:5003/practice`
- [ ] Seventh chord validation accepts both "Eb" and "E♭"
- [ ] Advanced mode persists after hard refresh
- [ ] No console errors on page load
- [ ] State management is working (check `window.learningState`)

## 🎯 Key Files to Understand

### Core Files (Read Headers)
- `public/js/main.js` - Main application logic and validation
- `public/js/state/learningState.js` - State management and persistence
- `public/js/data/quizData.js` - Data structure and constants
- `public/practice.html` - Script loading order

### Documentation Files (Read Completely)
- `DEVELOPMENT_STATUS.md` - Current status and architecture
- `docs/DEBUGGING_GUIDE.md` - Systematic debugging process

## 🚀 Ready to Help

After completing the reading above, you should be able to:

1. **Quickly diagnose** common issues using the debugging guide
2. **Understand** the state management system and persistence patterns
3. **Recognize** the validation logic and normalization requirements
4. **Follow** the established development workflow
5. **Maintain** the debugging efficiency we've built

## 📞 When You Need More Context

If you encounter something not covered in the documentation:

1. **Check the debugging guide** first for systematic approach
2. **Use console commands** to inspect current state
3. **Follow the testing checklist** to isolate issues
4. **Ask for clarification** on specific patterns or decisions

## 📝 Documentation Maintenance

### Keeping This Guide Current

**After making ANY significant changes, update these files:**

1. **DEVELOPMENT_STATUS.md** - Update:
   - Current version number
   - Recent fixes section
   - Architecture changes
   - Next steps

2. **docs/DEBUGGING_GUIDE.md** - Update:
   - New common issues discovered
   - Additional debugging commands
   - Updated testing checklist

3. **Code Headers** - Update:
   - `public/js/main.js` header comments
   - `public/js/state/learningState.js` header comments
   - Version numbers in comments

4. **This File (ASSISTANT_ONBOARDING.md)** - Update:
   - Current version and status
   - New common issues
   - Updated architecture overview
   - New debugging commands

### Documentation Update Checklist

When making changes, ask yourself:

- [ ] Does this change affect the architecture?
- [ ] Are there new debugging patterns to document?
- [ ] Do we have new common issues to watch for?
- [ ] Should version numbers be updated?
- [ ] Are there new dependencies or file relationships?

### Version Update Protocol

1. **Increment version numbers** in:
   - Script tags in `practice.html` (?v=15)
   - Header comments in main files
   - DEVELOPMENT_STATUS.md

2. **Update commit messages** to reference documentation updates:
   ```
   git commit -m "Fix [issue] and update documentation
   
   - Fix [specific issue]
   - Update DEVELOPMENT_STATUS.md with new version
   - Update debugging guide with new patterns
   - Update code headers with current status"
   ```

### Documentation Review Schedule

- **After each significant fix**: Update relevant docs immediately
- **Before starting new features**: Review and update docs if needed
- **When encountering new issues**: Document the debugging process
- **Before committing**: Ensure docs reflect current state

---

**Remember**: The goal is to maintain the debugging efficiency and targeted fixes we've developed. Read the documentation first, then apply the systematic approach to any new issues. 