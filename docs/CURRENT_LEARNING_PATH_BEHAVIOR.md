# Current Learning Path Behavior

## 📋 Current Structure (11 Levels)

1. **Introduction**: C major only (LINEAR, streak: 3)
2. **Level 1a Sharps**: G, D, A (LINEAR, streak: 3)  
3. **Level 1b Sharps**: G, D, A (TRIADS_ONLY, streak: 10)
4. **Level 1a Flats**: F, B♭, E♭ (LINEAR, streak: 3)
5. **Level 1b Flats**: F, B♭, E♭ (TRIADS_ONLY, streak: 10)
6. **Level 2a Sharps**: E, B, F♯ (LINEAR, streak: 3)
7. **Level 2b Sharps**: E, B, F♯ (TRIADS_ONLY, streak: 10)
8. **Level 2a Flats**: A♭, D♭, G♭ (LINEAR, streak: 3)
9. **Level 2b Flats**: A♭, D♭, G♭ (TRIADS_ONLY, streak: 10)
10. **Level 10: Naming Triads**: All 15 keys (NAMING_TRIADS, streak: 10) - **Triads Only**
11. **Level 11: Spelling Sevenths**: All keys (spelling_sevenths mode) - **Runs indefinitely**

## 🎯 **Naming Triads Pedagogical Enhancement**

### **Level 10 Behavior Updated**
- **Previous**: 4 question types (accCount, scale, triads, sevenths)
- **Current**: 1 question type (triads only) - **Pedagogically optimized**
- **Rationale**: Focus on core triad identification skills without distraction
- **Distribution**: 100% triad naming questions
- **Key Coverage**: All 15 major keys with true randomization

## 🎯 Chapter Progression (CORE_CHAPTERS)
- `accCount` → `accNotes` → `scale` → `triads` → `sevenths`
- **C major skips accNotes** (intentional - no accidentals)
- **Triads/Sevenths**: Require 3 correct answers per key
- **Others**: Advance immediately on correct answer

## 🔄 Mode Behaviors
- **LINEAR**: Sequential key/chapter progression (a-levels)
- **RANDOM_KEYS_LINEAR_CHAPTERS**: 
  - **a-levels**: Random keys, sequential chapters (CORE_CHAPTERS)
  - **b-levels**: Random keys, triads-only practice (TRIADS_ONLY_CHAPTERS)
- **NAMING_TRIADS**: Random keys, triads-only questions
- **SPELLING_SEVENTHS**: Random keys, sevenths-only questions (indefinite)

## ⚠️ Safety Protocols Currently in Place
- Protected functions in learningState.js
- Warning comments about modification risks
- Mandatory permission protocol referenced
- Working correctly warning

## 📊 Streak Requirements
- **a-levels (LINEAR)**: 3 correct answers
- **b-levels (TRIADS_ONLY)**: 10 correct triad answers
- **Level 10 (NAMING_TRIADS)**: 10 correct answers

---

**Baseline established - Ready for incremental improvements** 