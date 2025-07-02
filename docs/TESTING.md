# Music Theory Practice - Testing Guide

## 🔍 **MANDATORY: Systematic Research Methodology for Testing**

**ALL testing and debugging MUST follow our [Systematic Research Methodology](SYSTEMATIC_RESEARCH_METHODOLOGY.md).**

### Before Any Testing Work
1. **Use the [Research Template](RESEARCH_TEMPLATE.md)** for investigation
2. **Research systematically** - Understand the system before testing
3. **Never assume test failures** - Investigate root causes thoroughly
4. **Document findings** - Capture insights for future reference

### Testing with Research Methodology
- **Phase 1: Problem Decomposition** - What exactly is failing and why?
- **Phase 2: Systematic Code Research** - Investigate implementation and test logic
- **Phase 3: Evidence-Based Analysis** - Compare expected vs actual behavior
- **Phase 4: Targeted Resolution** - Fix root causes, not symptoms

**See [Headless Test Research Findings](HEADLESS_TEST_RESEARCH_FINDINGS.md) for a real example of this methodology successfully identifying complex testing issues.**

---

## 🧪 Comprehensive Test Suite

This app includes a comprehensive test suite that can be run at any time during development to ensure code quality and catch regressions.

### **🎯 Enhanced Headless Learning Path Test**

**Purpose**: Validates learning path progression and b-level behavior compliance.

**Key Features**:
- **Level Progression Tracking**: Monitors transitions through multiple levels
- **B-Level Compliance Validation**: Ensures b-levels ask ONLY triads questions  
- **Question Type Analysis**: Validates each level's allowed question types
- **Key Usage Verification**: Confirms appropriate keys for each level
- **Comprehensive Reporting**: Detailed behavior analysis with pass/fail status

**Usage**:
```bash
# Start development server first
npm run dev

# Run enhanced headless test
npm run test:headless
```

**Expected Test Flow**:
1. **Level 1** (Introduction): Mixed content validation
2. **Level 1a** (Sharps): Mixed content with accidentals  
3. **Level 1b** (Sharps b-level): **TRIADS ONLY** - critical UX validation
4. Comprehensive reporting with B-Level Compliance analysis

**Success Criteria**:
- ✅ All question/answer validations pass
- ✅ Level progression occurs correctly  
- ✅ B-levels show "TRIADS ONLY" compliance
- ✅ No mixed content violations in b-levels
- ✅ 100% success rate with comprehensive behavior validation

**Sample Success Output**:
```
🎯 B-Level Validation Summary:
   B-Levels Tested: 1b
   All B-Levels Valid: ✅ YES
   🎉 B-levels successfully use triads-only behavior!

🏆 Final Verdict:
🎉 ALL TESTS PASSED! Learning path and b-level behavior working correctly.
```

**This test validates the core UX improvement where b-levels provide focused triad practice instead of confusing mixed content.**

---

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