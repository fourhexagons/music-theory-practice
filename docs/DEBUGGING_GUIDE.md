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