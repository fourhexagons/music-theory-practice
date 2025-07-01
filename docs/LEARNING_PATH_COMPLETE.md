# Learning Path - Complete Documentation

**🔍 Created using [Systematic Research Methodology](SYSTEMATIC_RESEARCH_METHODOLOGY.md)**

## Overview

This document consolidates all learning path information into a single, authoritative reference. It was created by systematically researching the codebase implementation and documenting the actual behavior.

## 🚨 **CRITICAL: Learning Path Protection**

**Before making ANY changes to learning path logic, you MUST follow the [Learning Path Protection Protocol](LEARNING_PATH_PROTECTION.md).**

**Key Rule**: The learning path logic is working correctly. Any modifications require explicit permission and systematic research.

## Learning Path Progression

### **Key Sequence (Linear Mode)**
C → G → D → A → E → B → F# → C#

### **Chapter Sequence (Per Key - a-levels)**
1. **accCount** - "How many accidentals are in [Key] major?"
2. **accNotes** - "Name the accidentals in [Key] major." *(skipped for C major)*
3. **scale** - "Spell the [Key] major scale."
4. **triads** - "Name the [degree] triad in [Key] major." *(3 questions)*
5. **sevenths** - "Name the [degree] seventh chord in [Key] major." *(varies)*

### **b-level Behavior (Triads-Only Practice)**
- **All b-levels** (1b Sharps, 1b Flats, 2b Sharps, 2b Flats): **TRIADS ONLY**
- **Questions 1-10**: Random triad questions from the current group keys
- **No accidentals or scales** - focused triad reinforcement practice
- **Mode**: `RANDOM_KEYS_LINEAR_CHAPTERS` with `TRIADS_ONLY_CHAPTERS`

### **Advancement Rules**
- **a-levels**: accCount, accNotes, scale advance immediately; triads require 3 correct
- **b-levels**: All 10 questions are triads, requiring 10 correct total
- **Randomization**: 
  - **Triad degrees**: Always randomly selected from available degrees (2-7)
  - **Keys in b-levels**: Randomly selected from the current group
  - **Keys in a-levels**: Follow linear progression (not random)

## Special Behaviors

### **C Major accNotes Skipping**
**✅ CORRECT BEHAVIOR**: C major intentionally skips accNotes questions because C major has no accidentals.

**Implementation**: 
```284:291:src/state/learningState.js
if (chapter && chapter.id === 'accCount' && key && quizData && quizData[key] && quizData[key].accidentals === 0) {
  learningState.currentChapterIndex += 2; // Skip accNotes
} else {
  learningState.currentChapterIndex++;
}
```

**Result**: C major progression is accCount → scale → triads → sevenths

### **Key-Specific Data Structure**
Each key in `quizData` contains:
```javascript
"C": {
  "accidentals": 0,           // Number as string for accCount questions  
  "notes": [],                // Array (empty for C major)
  "scale": ["C", "D", "E", "F", "G", "A", "B"],  // Array requiring .join(' ')
  "triads": {
    "2": "Dm", "3": "Em", "4": "F", "5": "G", "6": "Am", "7": "B°"
  },
  "sevenths": {
    "2": "Dm7", "3": "Em7", "4": "Fmaj7", "5": "G7", "6": "Am7", "7": "Bm7♭5"
  }
}
```

## Expected Learning Path Behavior

### **C Major (Key 1)**
1. Q1: "How many accidentals are in C major?" → "0"
2. Q2: "Spell the C major scale." → "C D E F G A B"  
3. Q3-5: Three triad questions (random degrees 2,3,4,5,6,7)
4. Q6-8+: Seventh chord questions (3 correct required)

### **G Major (Key 2)**  
1. Q6: "How many accidentals are in G major?" → "1"
2. Q7: "Name the accidentals in G major." → "F#"  
3. Q8: "Spell the G major scale." → "G A B C D E F#"
4. Q9-11: Three triad questions
5. Q12-14+: Seventh chord questions

### **Subsequent Keys**
Follow the same pattern: accCount → accNotes → scale → triads → sevenths

## Architecture Implementation

### **Current System Components**

**NEW Modular System** (Active in dev server):
- `AppController` → `QuestionGenerator` → `StateManager`
- Uses correct C-major-only accNotes skipping logic
- Properly integrates with new architecture

**OLD Legacy System** (Active in preview server):
- Global functions with buggy accNotes skipping
- Skips accNotes for ALL keys in LINEAR mode
- Source of bugs that were systematically identified and fixed

### **Server Configuration**
- **Development** (`npm run dev`, port 5173): Live code with hot reload ✅
- **Preview** (`npm run preview`, port 4173): Tests production build ✅

## Testing and Verification

### **Automated Testing**
Use `test_headless_learning_path.js` to verify learning path progression:

```bash
# Ensure dev server is running
npm run dev

# Run headless test
npm run test:headless
```

**Expected Results**:
- Q1-5: C major (accCount → scale → 3 triads)
- Q6-8: G major (accCount → accNotes → scale)  
- Q9-10: G major triads
- 100% pass rate

### **Manual Testing**
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/practice`
3. Reset app and verify progression matches expected behavior

## Research History

### **Bug Discovery and Fix**
**Issue**: G major (and all non-C major keys) incorrectly skipped accNotes questions.

**Root Cause**: Architecture conflict between old and new systems:
- QuestionGenerator called buggy global functions instead of StateManager
- Global `getCurrentChapter()` skipped ALL accNotes in LINEAR mode
- Only C major should skip accNotes

**Resolution**: Updated QuestionGenerator to use StateManager consistently and fixed advanceLearningPath logic.

**Full Details**: See [Headless Test Research Findings](HEADLESS_TEST_RESEARCH_FINDINGS.md)

## Data Reference

### **Quiz Data Access**
```javascript
// Answer validation requires specific format conversion:
window.quizData[key].accidentals.toString()     // accCount: number → string
window.quizData[key].notes.join(' ')            // accNotes: array → spaced string  
window.quizData[key].scale.join(' ')            // scale: array → spaced string
window.quizData[key].triads[degree.toString()]  // triads: object lookup
window.quizData[key].sevenths[degree.toString()] // sevenths: object lookup
```

### **Learning State Structure**
```javascript
window.learningState = {
  currentGroup: 0,              // Index in learningPath array
  currentKeyIndex: 0,           // Index in current group's keys array  
  currentChapterIndex: 0,       // Index in current group's chapters array
  correctAnswersInChapter: 0,   // Progress toward requiredStreak
  usedDegrees: [],             // Degrees used in current chapter
  // ... additional state properties
}
```

## Troubleshooting

### **Common Issues**

**1. accNotes Questions Not Appearing**
- **Check**: Are you testing with the dev server (port 5173)?
- **Fix**: Use `npm run dev`, not `npm run preview`
- **Verify**: G major should show accNotes question as Q7

**2. Test Failures**  
- **Research**: Use systematic methodology - don't assume the cause
- **Check**: Are you using the correct URL (dev vs preview server)?
- **Debug**: Add debug logging to trace execution flow

**3. Unexpected Progression**
- **Verify**: Reset the app to start from C major
- **Check**: Confirm `window.learningState` values match expectations
- **Research**: Use Research Template to systematically investigate

### **Research Protocol**
For any learning path issues:
1. Use [Research Template](RESEARCH_TEMPLATE.md)
2. Follow [Systematic Research Methodology](SYSTEMATIC_RESEARCH_METHODOLOGY.md)  
3. Document findings for future reference
4. Never make assumptions - verify through code

## Conclusion

The learning path system is working correctly when using the proper development environment and following systematic research principles. All modifications must be approached with systematic research to maintain the working functionality.

**Key Takeaway**: Always research first, implement second. The learning path logic has been thoroughly tested and verified through systematic methodology. 