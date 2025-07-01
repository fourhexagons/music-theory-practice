# Headless Test Research Findings

## Overview

This document systematically documents findings from researching the music theory practice app codebase to build an accurate headless test. Each question is researched thoroughly by examining the actual code implementation rather than making assumptions.

## Research Methodology

1. **Break down complex problems into specific, answerable questions**
2. **Research each question by auditing the codebase systematically**
3. **Find exact implementations and code locations**
4. **Document findings with code references**
5. **Never make assumptions - always verify with code**

---

## Question 1: Regex Pattern for Key Extraction

### **Problem**
My regex `actualQuestion.match(/in ([A-G][b#]?) major/)` failed to extract "C" from "Spell the C major scale."

### **Research Findings**

**Exact Question Formats** (from `src/modules/business/services/QuestionGenerator.js`):
```javascript
// Line 39: accCount
question.text = `How many accidentals are in ${key} major?`;

// Line 43: accNotes  
question.text = `Name the accidentals in ${key} major.`;

// Line 48: scale
question.text = `Spell the ${key} major scale.`;

// Line 79: triads/sevenths
question.text = `${action} the ${window.ordinal(degree)} ${chordType} in ${question.key} major.`;
```

**Key Patterns:**
- **Types 1,2,4,5,6**: Use `"in ${key} major"` pattern
- **Type 3 (scale)**: Uses `"Spell the ${key} major scale"` pattern

### **Solution**
```javascript
// Extract key from question using two patterns
let keyMatch = actualQuestion.match(/in ([A-G][b#]?) major/);
if (!keyMatch) {
    keyMatch = actualQuestion.match(/Spell the ([A-G][b#]?) major scale/);
}
const currentKey = keyMatch ? keyMatch[1] : 'Unknown';
```

**Code Locations:**
- Question generation: `src/modules/business/services/QuestionGenerator.js:39-79`
- Alternative implementations: `src/modules/business/services/QuizService.js`, `src/components/main-app.js`

---

## Question 2: Quiz Data Structure & C Major Special Handling

### **Problem**
Understanding the exact structure of `window.quizData[key]` and why my test failed on Q2.

### **Research Findings**

**Exact Data Structure** (from `src/data/quizData.js:1-140`):
```javascript
"C": {
    "accidentals": 0,                           // NUMBER
    "notes": [],                                // ARRAY (empty for C major)  
    "scale": ["C", "D", "E", "F", "G", "A", "B"], // ARRAY of strings
    "triads": { "2": "Dm", "3": "Em", ... },   // OBJECT with string keys
    "sevenths": { "2": "Dm7", ... },           // OBJECT with string keys
    "seventhSpelling": { "2": ["D", "F", "A", "C"], ... } // OBJECT with arrays
}
```

**Answer Generation Logic:**
```javascript
// ✅ CORRECT implementations:
case 'accCount': return data.accidentals?.toString();     // number → string
case 'scale': return data.scale?.join(' ');               // array → space-separated string  
case 'accNotes': return data.notes?.join(' ');            // array → space-separated string
```

### **C Major Special Case Discovery**

**The Critical Rule:** C major accNotes questions are **skipped entirely** because C major has no accidentals.

**Implementation** (from `src/state/learningState.js:288-290`):
```javascript
if (chapter && chapter.id === 'accCount' && key && quizData && quizData[key] && quizData[key].accidentals === 0) {
    learningState.currentChapterIndex += 2; // Skip accNotes
} else {
    learningState.currentChapterIndex++;
}
```

**Actual C Major Sequence:**
- ✅ **Q1**: accCount ("How many accidentals in C major?") → "0"
- ❌ **Q2**: accNotes (SKIPPED - would be confusing to ask about non-existent accidentals)
- ✅ **Q2**: scale ("Spell the C major scale.") → "C D E F G A B"

**Why My Test Failed:**
- ❌ **Wrong expectation**: Q1→Q2 should be accCount→accNotes  
- ✅ **Correct behavior**: Q1→Q2 is actually accCount→scale (accNotes skipped)

**Code Locations:**
- Data structure: `src/data/quizData.js:1-140`
- Skipping logic: `src/state/learningState.js:288-290`
- Documentation: `src/state/learningState.js:22`, `ACTUAL_LEARNING_PATH.md:30`

---

## Next Research Questions

---

## Question 3: App Progression Logic

### **Problem**
The app repeated the same question instead of advancing to the next one. After a correct answer, what function should be called to advance to the next question?

### **Research Findings**

**App Architecture Discovery:**
The current app uses a **NEW modular system** (`AppController`) rather than the legacy `QuizService` system.

**Current Entry Points:**
- **URL**: `http://localhost:5173/practice` (development server)
- **HTML**: `practice.html` (clean URL routing)
- **Script**: `src/practice.js` → creates `PracticeApp` → initializes `AppController`

**Automatic Progression Flow** (from `src/modules/ui/controllers/AppController.js`):

```javascript
// 1. Form submission triggers handleAnswerSubmit() (line 119)
handleAnswerSubmit(userAnswer) {
    const isCorrect = this.answerValidator.validateAnswer(userAnswer, this.currentQuestion);
    if (isCorrect) {
        this.handleCorrectAnswer(); // Automatic progression starts here
    }
}

// 2. Correct answer handling (line 138)
handleCorrectAnswer() {
    this.answerForm.clearFeedback();           // Clears feedback
    this.answerForm.clearAnswer();             // Clears input 
    const result = this.stateManager.handleCorrectAnswer(); // State progression
    this.generateAndDisplayQuestion();         // Generates next question
}

// 3. Question generation (line 104)  
generateAndDisplayQuestion() {
    const question = this.questionGenerator.generateQuestion();
    this.questionDisplay.render(question.text); // Updates display automatically
}
```

**Key Discovery:** Progression is **completely automatic**. No manual function calls needed.

**Expected Flow:**
1. ✅ Submit answer via form → `handleAnswerSubmit()`
2. ✅ If correct → `handleCorrectAnswer()` 
3. ✅ Clears input/feedback automatically
4. ✅ Calls `StateManager.handleCorrectAnswer()` for progression logic
5. ✅ Calls `generateAndDisplayQuestion()` for next question
6. ✅ Updates DOM automatically with new question

**Why My Test May Be Failing:**
- ❓ **Wrong URL**: Maybe hitting old legacy system instead of new modular system
- ❓ **Timing issues**: Not waiting long enough for automatic progression
- ❓ **State corruption**: Learning state might be in invalid state

**Code Locations:**
- Main controller: `src/modules/ui/controllers/AppController.js:119-150`
- Entry point: `src/practice.js:32` → `AppController.initialize()`
- Form handling: `src/modules/ui/components/AnswerForm.js`
- State management: `src/modules/business/services/StateManager.js`

---

## Question 4: Answer Input Handling

### **Problem**
Should I clear the input field before typing the new answer? The input might have previous content.

### **Research Findings**

**Answer:** **NO** - Do not manually clear the input field. The app handles this automatically.

**Automatic Input Clearing** (from `src/modules/ui/controllers/AppController.js:149`):
```javascript
handleCorrectAnswer() {
    this.answerForm.clearFeedback();    // Auto-clears feedback
    this.answerForm.clearAnswer();      // Auto-clears input field ✅
    // ... progression logic
}
```

**Input Component Methods** (from `src/modules/ui/components/AnswerForm.js`):
```javascript
// Line 36: Clears input value
clearAnswer() {
    if (this.input) {
        this.input.value = '';
    }
}

// Line 32: Gets trimmed input value  
getAnswer() {
    return this.input ? this.input.value.trim() : '';
}
```

**Test Implications:**
- ✅ **Do**: Just type the answer directly - `page.type('#answer-input', answer)`
- ❌ **Don't**: Clear input manually - this might interfere with app flow
- ✅ **Do**: Trust the app to clear input automatically after correct answers

**Timing Considerations:**
The input clearing happens **immediately** after answer validation, so there should be no race conditions.

**Code Locations:**
- Input component: `src/modules/ui/components/AnswerForm.js:36-42`
- Auto-clearing logic: `src/modules/ui/controllers/AppController.js:149`
- Alternative clearing: `src/modules/ui/components/QuestionDisplay.js:20`

---

---

## Bug Discovery: G Major AccNotes Skipping

### **Problem Found During Testing**
My systematic test revealed that G major accNotes questions are being incorrectly skipped:
- ✅ **Expected**: Q6 accCount → Q7 accNotes → Q8 scale  
- ❌ **Actual**: Q6 accCount → Q7 scale → Q8 scale (accNotes skipped)

### **Root Cause Analysis**
**Bug Location:** `src/state/learningState.js:264-268`

The **global `getCurrentChapter()` function** has incorrect logic that skips ALL accNotes questions in LINEAR mode:

```javascript
// For linear mode, ensure accidentals naming is never selected standalone
const currentChapter = group.chapters[currentChapterIndex];
if (currentChapter && currentChapter.id === 'accNotes') {
  // Skip accidentals naming if we're not in a pair
  return group.chapters[currentChapterIndex + 1] || group.chapters[0];
}
```

**System Conflict:**
- ✅ **NEW StateManager** (`src/modules/business/services/StateManager.js:24-27`): Has correct C-major-only skipping
- ❌ **OLD global functions** (`src/state/learningState.js:264-268`): Incorrectly skips ALL accNotes in linear mode
- ❌ **QuestionGenerator** (`src/modules/business/services/QuestionGenerator.js:18-19`): Calls OLD global functions

**The Fix:**
QuestionGenerator should use StateManager methods instead of buggy global functions.

**Code Locations:**
- Bug source: `src/state/learningState.js:264-268`
- Correct logic: `src/modules/business/services/StateManager.js:24-27`  
- Fix needed: `src/modules/business/services/QuestionGenerator.js:18-19`

---

## Key Learning: Systematic Research Prevents Assumptions

This bug was only discovered because I:
1. **Systematically tested** the actual app behavior
2. **Compared results** against documented expectations  
3. **Researched codebase** instead of making assumptions
4. **Found conflicting systems** that assumptions would have missed

**The systematic approach successfully identified a real bug that affects the core learning progression!**

---

## Key Insights

1. **Never assume question patterns** - different question types use different text formats
2. **C major is a special case** - accNotes questions are completely skipped
3. **Data types matter** - numbers need `.toString()`, arrays need `.join(' ')`
4. **The app implements complex logic** - simple assumptions about progression are often wrong
5. **Code locations are spread across multiple files** - check QuestionGenerator, StateManager, and data files

---

## 🚀 **Major Enhancement Update (2024): B-Level Validation Capabilities**

### **Enhancement Overview**
Building on the systematic research foundation documented above, the headless test has been significantly enhanced to validate the **critical UX improvement** where b-levels now provide focused triad practice instead of confusing mixed content.

### **New Capabilities Added**
1. **Level Progression Tracking**: Monitors transitions (1 → 1a → 1b → 2a → 2b)
2. **B-Level Compliance Validation**: Ensures b-levels ask ONLY triads questions  
3. **Question Type Analysis**: Validates each level's allowed question types per level expectations
4. **Key Usage Verification**: Confirms appropriate keys for each level
5. **Comprehensive Reporting**: Detailed level behavior analysis with clear pass/fail status

### **Technical Implementation**
The enhanced test adds sophisticated validation logic:

```javascript
// Level behavior expectations with b-level identification
const LEVEL_EXPECTATIONS = {
    '1b': { // Level 1b Sharps/Flats - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['G', 'D', 'A', 'F', 'Bb', 'Eb'],
        isB_Level: true,
        expectedStreak: 10
    }
    // ... other levels
};

// B-level compliance validation
if (expectations.isB_Level && !expectations.allowedQuestionTypes.includes(questionType)) {
    logResult('fail', `❌ B-Level Violation: Level ${currentLevel} asked ${questionType}, but should only ask: ${expectations.allowedQuestionTypes.join(', ')}`);
}
```

### **Real Test Results**
The enhanced test successfully validated the b-level UX improvement:

```
📋 Level 1b:
   Questions Asked: 26
   Question Types: triads
   Keys Used: G
   B-Level Compliance: ✅ TRIADS ONLY
   Behavior Valid: ✅

🎯 B-Level Validation Summary:
   B-Levels Tested: 1b
   All B-Levels Valid: ✅ YES
   🎉 B-levels successfully use triads-only behavior!
```

### **Impact and Value**
This enhancement transforms the headless test from a basic progression checker into a **comprehensive learning path behavior validator** that:

- **Prevents UX regressions** by automatically detecting if b-levels revert to mixed content
- **Validates architectural changes** like switching from `CORE_CHAPTERS` to `TRIADS_ONLY_CHAPTERS`
- **Provides confidence** that the core UX improvement is working correctly
- **Enables systematic validation** of learning path modifications

### **Future-Proofing**
The enhanced test is designed to easily accommodate additional levels and validation rules as the learning path evolves, maintaining the systematic research methodology that made the original implementation successful.

**This enhancement demonstrates how systematic research methodology enables building robust, maintainable testing infrastructure that grows with the application's complexity.**

---

## Code Reference Map

| Feature | Primary Location | Notes |
|---------|------------------|-------|
| Question Generation | `src/modules/business/services/QuestionGenerator.js` | Modern modular system |
| Learning State | `src/state/learningState.js` | Current implementation |
| Quiz Data | `src/data/quizData.js` | Current data structure |
| C Major Logic | `src/state/learningState.js:288-290` | Skipping logic documented in line 22 |
| Progression Rules | `cursor/docs/ACTUAL_LEARNING_PATH.md` | User's personal archive |
| **Enhanced Test** | `test_headless_learning_path.js` | **B-level validation capabilities** | 