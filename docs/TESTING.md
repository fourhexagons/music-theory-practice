# Music Theory Practice - Testing Guide

## 🧪 Comprehensive Test Suite

This app includes a comprehensive test suite that can be run at any time during development to ensure code quality and catch regressions.

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