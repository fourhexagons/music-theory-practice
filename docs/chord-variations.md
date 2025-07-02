# Chord Variations Reference

## Overview

This document provides a comprehensive reference for all chord input variations supported by the Music Theory Practice app. The normalization system accepts multiple input formats and converts them to standardized output formats for consistent validation.

**Implementation Note:** The system uses dual pattern matching - both lowercase and uppercase variations are supported for maximum user flexibility.

## Quick Reference

| Chord Type | Standard Output | Input Variations |
|------------|----------------|------------------|
| Major Triad | C | C, C major, C maj, C MAJOR, C MAJ |
| Minor Triad | Cm | Cm, C minor, C min, C-, C MINOR, C MIN |
| Dominant 7th | C7 | C7, C dominant, C dom, C DOMINANT, C DOM, C dominant7, C dom7, C DOMINANT7, C DOM7, C dominant 7, C dom 7, C DOMINANT 7, C DOM 7 |
| Major 7th | Cmaj7 | Cmaj7, C maj7, C major7, CM7, C∆, CΔ, C∆7, CΔ7, C MAJ7, C MAJOR7 |
| Minor 7th | Cm7 | Cm7, C min7, C minor7, C-7, Cminor7, C MIN7, C MINOR7 |
| Half-Diminished 7th | Cm7♭5 | Cm7b5, C m7flat5, C halfdiminished, C halfdim, CØ, Chalfdiminished, C HALFDIMINISHED, C HALFDIM |
| Diminished Triad | C˚ | Cdim, C diminished, C dim, Cdiminished, C DIMINISHED, C DIM |
| Note Spellings | C | C# E G# B, C# E G#, etc. (returns root note) |

## Detailed Reference

### Major Triad
**Standard Output:** C
**Accepted Inputs:** C, C major, C maj, C MAJOR, C MAJ

### Minor Triad  
**Standard Output:** Cm
**Accepted Inputs:** Cm, C minor, C min, C-, C MINOR, C MIN

### Dominant 7th
**Standard Output:** C7
**Accepted Inputs:** C7, C dominant, C dom, C DOMINANT, C DOM, C dominant7, C dom7, C DOMINANT7, C DOM7, C dominant 7, C dom 7, C DOMINANT 7, C DOM 7

### Major 7th
**Standard Output:** Cmaj7
**Accepted Inputs:** Cmaj7, C maj7, C major7, CM7, C∆, CΔ, C∆7, CΔ7, C MAJ7, C MAJOR7

### Minor 7th
**Standard Output:** Cm7
**Accepted Inputs:** Cm7, C min7, C minor7, C-7, Cminor7, C MIN7, C MINOR7

### Half-Diminished 7th
**Standard Output:** Cm7♭5
**Accepted Inputs:** Cm7b5, C m7flat5, C halfdiminished, C halfdim, CØ, Chalfdiminished, C HALFDIMINISHED, C HALFDIM

### Diminished Triad
**Standard Output:** C˚
**Accepted Inputs:** Cdim, C diminished, C dim, Cdiminished, C DIMINISHED, C DIM

### Note Spellings
**Standard Output:** C (root note)
**Accepted Inputs:** Space-separated note spellings like "C# E G# B", "C# E G#", etc.
**Note:** When users input note spellings (e.g., "C# E G# B" for a C# minor 7th), the system extracts and returns the root note (C#).

## Implementation Details

### Pattern Matching Strategy
The system uses dual matching for maximum flexibility:

1. **Lowercase matching:** For no-space variations (cmajor7, cminor7)
2. **Uppercase matching:** For spaced variations (C MAJOR7, C MINOR7)

### Priority Order
1. Minor 7th detection (before major 7th to avoid conflicts)
2. Major 7th detection
3. Half-diminished detection
4. Diminished detection
5. Minor detection
6. Major detection

### Case Insensitivity
All text-based inputs are case-insensitive:
- C major = c major = C Major
- C minor = c minor = C Minor

### Space Handling
- Spaces are automatically removed during processing
- Inputs with or without spaces are accepted
- Multiple spaces are normalized to single spaces before processing

### Accidental Handling
- b (lowercase) = ♭ (flat)
- # = ♯ (sharp)
- Unicode accidentals are preserved
- Mixed formats are supported: Db7 = D♭7

### Special Characters
- ∆ (U+2206) and Δ (U+0394) = major 7th
- Ø = half-diminished 7th
- - (dash) = minor ONLY
- ˚ = diminished

### Dash Usage
**Important:** The dash (-) character ONLY represents minor chords. It is NOT used for other variations like "half-diminished" or "diminished".

**Correct:** C- = C minor, C-7 = C minor 7th
**Incorrect:** C-halfdim, C-dim (these are NOT supported)

## Testing

Run the test suite to verify all variations:
```bash
open test_chords.html
```

## Maintenance

When adding new chord variations:
1. Update this documentation
2. Add test cases to test_chords.html
3. Verify normalization in main.js
4. Test with various case combinations 