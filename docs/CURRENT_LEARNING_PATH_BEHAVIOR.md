# Current Learning Path Behavior (v1.5.3)

## 📋 Current Structure (12 Levels + Complete)

1. **Introduction**: C major only (LINEAR, streak: 3)
2. **Level 1a Sharps**: G, D, A (LINEAR, streak: 3)  
3. **Level 1b Sharps**: G, D, A (RANDOM_KEYS_LINEAR_CHAPTERS, streak: 5)
4. **Level 1a Flats**: F, B♭, E♭ (LINEAR, streak: 3)
5. **Level 1b Flats**: F, B♭, E♭ (RANDOM_KEYS_LINEAR_CHAPTERS, streak: 5)
6. **Level 2a Sharps**: E, B, F♯ (LINEAR, streak: 3)
7. **Level 2b Sharps**: E, B, F♯ (RANDOM_KEYS_LINEAR_CHAPTERS, streak: 5)
8. **Level 2a Flats**: A♭, D♭, G♭ (LINEAR, streak: 3)
9. **Level 2b Flats**: A♭, D♭, G♭ (RANDOM_KEYS_LINEAR_CHAPTERS, streak: 5)
10. **Level 3 Sharps**: All sharp keys (RANDOM_ALL, streak: 5)
11. **Level 3 Flats**: All flat keys (RANDOM_ALL, streak: 5)
12. **Complete!**: End of path

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
- **RANDOM_ALL**: Random keys and chapters
- **COMPLETE**: End state

## ⚠️ Safety Protocols Currently in Place
- Protected functions in learningState.js
- Warning comments about modification risks
- Mandatory permission protocol referenced
- Working correctly warning

## 📊 Streak Requirements
- **a-levels (LINEAR)**: 3 correct answers
- **b-levels (TRIADS_ONLY)**: 10 correct triad answers
- **Level 3 (RANDOM_ALL)**: 5 correct answers
- **Triads/Sevenths in a-levels**: Always 3 per key regardless of mode

---

**Baseline established for v1.5.3 - Ready for incremental improvements** 