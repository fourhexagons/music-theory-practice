# Music Theory Practice - Debugging Guide

## 🚨 Emergency Quick Fixes

### Blank Page on Load
```bash
# 1. Check script versions - update if needed
# In practice.html, change ?v=14 to ?v=15

# 2. Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 3. Check console for errors
# Look for "undefined" errors or script loading failures
```

### State Not Persisting
```bash
# 1. Check if MODES are defined
console.log(window.MODES);

# 2. Check current state
console.log(window.learningState);

# 3. Force reset if corrupted
window.resetLearningState();
```

### Correct Answers Marked Incorrect
```bash
# 1. Check normalization
console.log('Input:', normalizeChord(userInput));
console.log('Expected:', normalizeChord(expectedAnswer));

# 2. Check for accidental mismatches
# ASCII "b" vs Unicode "♭"
```

## 🔍 Systematic Debugging Process

### Step 1: Identify the Problem Type
- **State Issue**: App reverts to defaults after refresh
- **Validation Issue**: Correct answers marked wrong
- **Loading Issue**: Blank page or console errors
- **UI Issue**: Elements not appearing or behaving incorrectly

### Step 2: Check Dependencies
```javascript
// Essential objects that must be loaded
console.log('quizData:', !!window.quizData);
console.log('learningState:', !!window.learningState);
console.log('learningPath:', !!window.learningPath);
console.log('MODES:', !!window.MODES);
console.log('CHAPTERS:', !!window.CHAPTERS);
```

### Step 3: Check State Integrity
```javascript
// Validate learning state
console.log('Current state:', window.learningState);
console.log('Is advanced mode:', window.learningState.isAdvancedMode);
console.log('Advanced type:', window.learningState.advancedModeType);
console.log('Current question:', window.learningState.currentQuestion);
```

### Step 4: Check Script Loading Order
The correct order in `practice.html`:
1. `errorHandler.js`
2. `helpers.js`
3. `quizData.js` (defines MODES, CHAPTERS, learningPath)
4. `normalization.js`
5. `learningState.js`
6. `practice-menu.js`
7. `main.js`

## 🐛 Common Issues & Solutions

### Issue: "window.MODES is undefined"
**Cause**: `quizData.js` not loaded or loaded after files that need it
**Solution**: 
- Check script loading order
- Update version numbers to bust cache
- Verify `quizData.js` contains MODES definition

### Issue: "Cannot read property of undefined"
**Cause**: Object not loaded or initialized
**Solution**:
- Add null checks: `if (window.learningState && window.learningState.currentQuestion)`
- Check initialization order
- Add fallback initialization

### Issue: State resets on refresh
**Cause**: State not properly saved or restored
**Solution**:
- Ensure `saveLearningState()` is called after state changes
- Check `initLearningState()` is called before app initialization
- Verify localStorage is working

### Issue: Chord validation fails
**Cause**: Normalization mismatch or data structure issue
**Solution**:
- Use `accidentalToUnicode()` for both input and expected
- Check chord data structure in `quizData.js`
- Verify degree indexing (1-7, not 0-6)

## 🛠️ Development Tools

### Console Debugging Commands
```javascript
// Check current state
console.log(window.learningState);

// Check if in advanced mode
console.log('Advanced mode:', window.learningState.isAdvancedMode);

// Check current question details
console.log('Question:', window.learningState.currentQuestion);

// Test normalization
console.log('Normalized:', accidentalToUnicode('Eb'));

// Force state reset
window.resetLearningState();

// Check localStorage
console.log('Saved state:', localStorage.getItem('learningState'));
```

### Browser DevTools
- **Network Tab**: Check if all scripts load (200 status)
- **Console Tab**: Look for errors and undefined objects
- **Application Tab**: Check localStorage for saved state
- **Sources Tab**: Set breakpoints in initialization functions

## 📋 Testing Checklist

### Basic Functionality
- [ ] Page loads without errors
- [ ] Questions appear correctly
- [ ] Answer submission works
- [ ] Feedback shows correctly

### State Persistence
- [ ] Normal refresh maintains state
- [ ] Hard refresh maintains state
- [ ] Advanced mode persists
- [ ] Progress is saved

### Validation
- [ ] Correct answers are accepted
- [ ] Incorrect answers are rejected
- [ ] Both ASCII and Unicode accidentals work
- [ ] Chord spelling validation works

### Error Handling
- [ ] Invalid state shows helpful message
- [ ] Script loading errors are handled
- [ ] Fallback initialization works

## 🔧 Quick Fixes by Symptom

### Symptom: "Cannot read property 'currentQuestion' of undefined"
**Quick Fix**: Add null check in `main.js`
```javascript
if (window.learningState && window.learningState.currentQuestion) {
    // proceed with question logic
}
```

### Symptom: Advanced mode doesn't persist
**Quick Fix**: Ensure state is saved immediately
```javascript
window.learningState.isAdvancedMode = true;
window.learningState.advancedModeType = mode;
window.saveLearningState(); // Add this line
```

### Symptom: Script loading errors
**Quick Fix**: Update version numbers
```html
<script src="/js/main.js?v=15"></script>
<script src="/js/state/learningState.js?v=15"></script>
```

## 📞 When to Start Fresh
If you encounter:
- Multiple undefined errors
- State corruption that can't be reset
- Script loading failures that persist

**Solution**: 
1. Clear browser cache completely
2. Restart Firebase server
3. Check for syntax errors in recent changes
4. Consider reverting to last known good state

## 🎯 Pro Tips
- **Always check console first** - most issues show up there
- **Update version numbers** when making changes to bust cache
- **Test on hard refresh** - this catches most state issues
- **Use the debugging commands** above to quickly diagnose problems
- **Keep this guide updated** with new patterns you discover

## 📝 Documentation Maintenance

### When to Update This Guide

**Update this debugging guide when you discover:**

1. **New Common Issues** - Add to "Common Issues & Solutions" section
2. **Better Debugging Commands** - Add to "Console Debugging Commands"
3. **New Testing Patterns** - Update "Testing Checklist"
4. **Improved Quick Fixes** - Update "Quick Fixes by Symptom"
5. **New Error Messages** - Add to debugging process

### Documentation Update Process

1. **Document the Issue** - Write down what happened
2. **Document the Solution** - Record how you fixed it
3. **Update Relevant Sections** - Add to appropriate parts of this guide
4. **Test the Documentation** - Make sure it's clear and actionable
5. **Commit with Documentation** - Include doc updates in commit message

### Example Documentation Update

When you discover a new issue:

```markdown
### Issue: "Cannot read property 'chordData' of undefined"
**Cause**: quizData not loaded or corrupted
**Solution**: 
- Check if window.quizData exists
- Verify quizData.js loads before main.js
- Update script version numbers
```

### Keeping Debugging Commands Current

**Add new useful commands to the "Console Debugging Commands" section:**

```javascript
// New useful command discovered
console.log('Chord data loaded:', !!window.quizData);
```

### Version Tracking

- **Update version numbers** when making changes that affect debugging
- **Note version in commit messages** when updating this guide
- **Reference this guide** in other documentation updates

---

**Remember**: This guide is only useful if it stays current. Update it as you learn new debugging patterns! 