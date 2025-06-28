# Music Theory Practice - Testing Guide

## 🧪 Comprehensive Test Suite

This app includes a comprehensive test suite that can be run at any time during development to ensure code quality and catch regressions.

## 🔍 SYSTEMATIC DEBUGGING APPROACH

**CRITICAL: Before fixing any test failures, follow this systematic approach**

### The Problem with Quick Fixes
Developers and assistants often make mistakes when they:
- Assume they understand the test failure immediately
- Apply the first fix that comes to mind
- Don't investigate the root cause
- Make changes without understanding the full context

### Systematic Investigation Protocol

#### Step 1: UNDERSTAND THE FAILURE
**DO NOT** start coding immediately. Instead:

1. **Read the test failure carefully**
   - What exactly is failing?
   - What was the expected vs actual result?
   - Which test case is failing?

2. **Examine the test code**
   - Understand what the test is trying to verify
   - Check if the test logic is correct
   - Verify the expected values make sense

3. **Check the implementation**
   - Look at the function being tested
   - Understand how it should work
   - Identify potential issues

#### Step 2: INVESTIGATE THE CONTEXT
**DO NOT** assume the problem is where you first look:

1. **Check recent changes**
   ```bash
   git log --oneline -10  # Recent commits
   git show <commit> --name-only  # What files changed
   ```

2. **Look for related issues**
   - Are there similar test failures?
   - Is this part of a larger problem?
   - Are there other functions with similar logic?

3. **Consider the broader impact**
   - Will fixing this break other functionality?
   - Are there edge cases to consider?
   - Is this a symptom of a larger issue?

#### Step 3: FORM A HYPOTHESIS
**DO NOT** proceed without a clear understanding:

1. **Document your theory**
   - Write down what you think is wrong
   - Explain why you think this is the issue
   - List your assumptions

2. **Gather evidence**
   - Look for supporting evidence
   - Check for contradictory evidence
   - Test your hypothesis with additional debugging

3. **Consider alternatives**
   - What else could be causing this?
   - Are there other explanations?
   - What would disprove your theory?

#### Step 4: IMPLEMENT AND VERIFY
**DO NOT** make changes until you're certain:

1. **Make minimal changes**
   - Fix only what's necessary
   - Preserve working functionality
   - Document your changes

2. **Test thoroughly**
   - Run the specific failing test
   - Run all related tests
   - Run the full test suite

3. **Verify the fix**
   - Confirm the test now passes
   - Ensure no new failures
   - Test edge cases

### Real Example: Seventh Chord Validation Issue

**Test Failure**: Seventh chord spelling validation was failing with key mismatches.

**Systematic Investigation**:

1. **Understood the failure**: Keys shown in questions didn't match keys used in validation
2. **Investigated context**: Found the issue was in `startAdvancedPractice()`, not the main validation logic
3. **Formed hypothesis**: Multiple random key selections were causing inconsistency
4. **Implemented fix**: Selected key once and reused it throughout the function

**Result**: Complete resolution with no regressions.

### Key Principles

1. **Always investigate before coding**
2. **Consider multiple possible causes**
3. **Look for patterns and related issues**
4. **Make minimal, targeted fixes**
5. **Test thoroughly after changes**
6. **Document your process**

**This systematic approach prevents the most common debugging mistakes.**

---

## 🚀 Running Tests

### Keyboard Shortcut (Recommended)
- **Press**: `Ctrl+Shift+Q` (Windows/Linux) or `Cmd+Shift+Q` (Mac)
- **What happens**: 
  - Clears console
  - Runs all tests
  - Shows results in new tab (or overlay if popup blocked)
  - Logs detailed results to console

### Method 2: Console Command
Open the browser console and run:
```javascript
MusicTheoryTests.runAllTests()
```

### Method 3: Individual Test Categories
```javascript
// Run specific test categories
MusicTheoryTests.runChordNormalizationTests()
MusicTheoryTests.runAccidentalNormalizationTests()
MusicTheoryTests.runFunctionExistenceTests()
MusicTheoryTests.runAppStateTests()
```

## 📊 Test Categories

### 🎵 Chord Normalization (61 tests)
Tests all chord symbol variations and normalization:
- Major 7th chords: `Cmaj7`, `CM7`, `CΔ`, `CΔ7`, `CMAJ7`, `CMAJOR7`
- Minor chords: `Cm`, `C-`, `Cmin`, `Cminor`
- Diminished chords: `C˚`, `Cdim`, `Cdimin`, `Cdiminished`
- Dominant 7th: `C7`, `Cdom`, `Cdominant`
- Minor 7th: `Cm7`, `C-7`, `Cmin7`, `Cminor7`
- Half diminished: `Cm7b5`, `Cø`, `Cø7`
- Accidental handling: `Bb` → `B♭`, `F#` → `F♯`

### 🎼 Accidental Normalization (40+ tests)
Tests note/accidental conversion to Unicode:
- Basic accidentals: `Bb` → `B♭`, `F#` → `F♯`
- Double accidentals: `Bbb` → `B♭♭`, `F##` → `F♯♯`
- Edge cases: standalone `b` → `B`, empty strings, invalid input
- Mixed case: `bb` → `B♭`, `f#` → `F♯`
- Whitespace handling
- Mixed notation: `Bb♭` → `B♭♭`

### 🔧 Function Existence (8 tests)
Verifies that all core functions exist and are callable:
- `normalizeChord`, `accidentalToUnicode`, `normalizeAccList`
- `checkAnswer`, `askQuestion`, `initLearningState`
- `saveLearningState`, `renderAppLayout`

### 📊 App State (5 tests)
Tests app state management and initialization:
- `learningState`, `quizData`, `learningPath` objects exist
- `QUESTION_TYPES`, `MODES` constants exist

## 📈 Test Results

### Console Output
- Real-time test progress
- Summary with pass/fail counts and success rate
- Detailed failure information for debugging

### HTML Report
- Beautiful, professional report in new tab (or overlay if popup blocked)
- Color-coded results (green for passed, red for failed)
- Category-by-category breakdown
- Detailed failure descriptions
- Timestamp of when tests were run

## ⚙️ Configuration

The test system can be configured by modifying `TEST_CONFIG` in `tests.js`:

```javascript
const TEST_CONFIG = {
  autoRun: false,           // Auto-run tests on page load
  keyboardShortcut: true,   // Enable Ctrl+Shift+T shortcut
  showConsoleOutput: true,  // Show detailed console output
  openInNewTab: true        // Open results in new tab
};
```

## 🔧 Adding New Tests

### 1. Add Test Function
Create a new test function in `tests.js`:

```javascript
function runMyNewTests() {
  const tests = [
    { input: "test1", expected: "result1", description: "Test 1" },
    { input: "test2", expected: "result2", description: "Test 2" }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  tests.forEach(test => {
    try {
      const result = myFunction(test.input);
      if (result === test.expected) {
        passed++;
      } else {
        failed++;
        failures.push(`${test.description}: got "${result}" (expected "${test.expected}")`);
      }
    } catch (error) {
      failed++;
      failures.push(`${test.description}: Error - ${error.message}`);
    }
  });

  return TEST_UTILS.createTestResult(passed, failed, failures, tests.length);
}
```

### 2. Add to Test Categories
Add your new test to `TEST_CATEGORIES`:

```javascript
const TEST_CATEGORIES = {
  // ... existing categories ...
  myNewTests: {
    name: '🎯 My New Tests',
    description: 'Tests for my new functionality',
    run: runMyNewTests
  }
};
```

## 🎯 Best Practices

1. **Run tests frequently** during development to catch issues early
2. **Add tests for new features** to prevent regressions
3. **Use descriptive test names** that explain what's being tested
4. **Test edge cases** like empty strings, invalid input, and boundary conditions
5. **Keep tests independent** - each test should not depend on others

## 🐛 Debugging Failed Tests

1. **Check console output** for detailed error messages
2. **Review HTML report** for specific failure details
3. **Test individual functions** using the console commands
4. **Add console.log statements** to test functions for debugging
5. **Check function signatures** and expected return values

## 📝 Test File Structure

```
public/js/tests.js          # Main test suite
TESTING.md                  # This documentation
```

The test system is designed to be:
- **Non-intrusive** - doesn't affect app functionality
- **Easy to use** - keyboard shortcut for quick access
- **Comprehensive** - covers all critical functions
- **Maintainable** - easy to add new tests
- **Professional** - beautiful reports for stakeholders 