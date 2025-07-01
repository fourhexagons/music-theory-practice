# Learning Path Logic Protection Protocol

## 🚨 CRITICAL WARNING: DO NOT MODIFY LEARNING PATH LOGIC 🚨

This document establishes a **MANDATORY protocol** to prevent accidental changes to the working learning path logic.

## Protected Files and Functions

**NEVER modify these without explicit permission:**

### Core Learning Path Logic
- `src/state/learningState.js`
  - `advanceLearningPath()` function
- `src/modules/business/services/StateManager.js`
  - `getCurrentChapter()` function  
  - `getCurrentKey()` function
  - `getCurrentGroup()` function
  - `recordCorrectAnswer()` function
  - `recordIncorrectAnswer()` function

### Question Generation
- `src/modules/business/services/QuestionGenerator.js`
  - Question generation logic

### State Management
- Any function that modifies `learningState.currentGroup`
- Any function that modifies `learningState.currentKeyIndex`
- Any function that modifies `learningState.currentChapterIndex`

## Mandatory Protocol

### Step 1: STOP and IDENTIFY
When you're about to modify any protected file/function:
1. **STOP** immediately
2. **IDENTIFY** which specific function you're about to change
3. **CONFIRM** it's actually necessary

### Step 2: ASK FOR PERMISSION
**You MUST ask the user this exact question:**
> "I'm about to modify the learning path logic in [specific file/function]. This could break the app's progression from C major → G major → D major, etc. Do you want me to proceed, or should I find an alternative solution?"

### Step 3: CONSIDER ALTERNATIVES FIRST
Before modifying learning path logic, exhaust these alternatives:

#### UI/UX Changes (Safe)
- Modify button text, styling, layout
- Change how information is displayed
- Add new UI elements or screens
- Improve user feedback and messages

#### Question Generation (Safe)
- Change how questions are worded
- Modify answer validation logic
- Add new question types (without changing progression)
- Improve question randomization

#### State Display (Safe)
- Change how progress is shown to users
- Modify progress bars, indicators
- Add new status displays
- Improve error messages

#### Data and Validation (Safe)
- Modify quiz data structure
- Change answer checking logic
- Add new validation rules
- Improve error handling

### Step 4: IF PERMISSION GRANTED
1. **Create backup branch**: `git checkout -b backup-learning-path-$(date +%Y%m%d)`
2. **Make minimal changes**: Only modify the specific function needed
3. **Test thoroughly**: Verify progression still works: C → G → D → A → E → B → F# → C#
4. **Document changes**: Add comments explaining exactly what was changed and why
5. **Commit carefully**: Use descriptive commit message

### Step 5: REMEMBER THE WORKING PATTERN
The current learning path logic works correctly:

```
Key Progression: C → G → D → A → E → B → F# → C#
Chapter Progression: accCount → accNotes → scale → triads → sevenths
Special Cases: C major skips accNotes (0 accidentals)
Requirements: Triads/sevenths need 3 correct answers, others advance immediately
```

## Why This Protocol Exists

1. **The learning path logic is working correctly**
2. **Previous attempts to "fix" it broke the app**
3. **The progression is predictable and user-friendly**
4. **Changes can have cascading effects throughout the app**

## Enforcement

- **All assistants must follow this protocol**
- **All developers must follow this protocol**
- **No exceptions without explicit user permission**
- **Violations can break the app's core functionality**

## Emergency Protocol

If the learning path logic is somehow broken:
1. **DO NOT attempt fixes**
2. **Revert to the last known working commit**: `git reset --hard ff3fdad`
3. **Restart the server**: `./serve-clean.sh`
4. **Ask the user for guidance**

---

**This protocol is MANDATORY and non-negotiable.** 