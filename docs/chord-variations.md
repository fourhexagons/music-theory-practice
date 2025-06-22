# Chord Variations Reference

## Overview

This document provides a comprehensive reference for all chord input variations supported by the Music Theory Practice app. The normalization system accepts multiple input formats and converts them to standardized output formats for consistent validation.

**Note:** All inputs are case-insensitive. The examples below show the standard format (note name capitalized, quality lowercase), but users can input in any case.

## Quick Reference

| Chord Type | Standard Output | Input Variations |
|------------|----------------|------------------|
| Major Triad | C | C, C major, C maj |
| Minor Triad | Cm | Cm, C minor, C min, C- |
| Dominant 7th | C7 | C7 |
| Major 7th | Cmaj7 | Cmaj7, C maj7, C major7, CM7, C∆, CΔ, C∆7, CΔ7 |
| Minor 7th | Cm7 | Cm7, C min7, C minor7, C-7, Cminor7 |
| Half-Diminished 7th | Cm7♭5 | Cm7b5, C halfdiminished, C halfdim, CØ, Chalfdiminished |
| Diminished Triad | C˚ | Cdim, C diminished, C dim, Cdiminished |

## Detailed Reference

### Major Triad
**Standard Output:** C
**Accepted Inputs:** C, C major, C maj

### Minor Triad  
**Standard Output:** Cm
**Accepted Inputs:** Cm, C minor, C min, C-

### Dominant 7th
**Standard Output:** C7
**Accepted Inputs:** C7

### Major 7th
**Standard Output:** Cmaj7
**Accepted Inputs:** Cmaj7, C maj7, C major7, CM7, C∆, CΔ, C∆7, CΔ7

### Minor 7th
**Standard Output:** Cm7
**Accepted Inputs:** Cm7, C min7, C minor7, C-7, Cminor7

### Half-Diminished 7th
**Standard Output:** Cm7♭5
**Accepted Inputs:** Cm7b5, C halfdiminished, C halfdim, CØ, Chalfdiminished

### Diminished Triad
**Standard Output:** C˚
**Accepted Inputs:** Cdim, C diminished, C dim, Cdiminished

## Input Processing Rules

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

## Implementation Notes

### Pattern Matching Strategy
The system uses dual matching:
1. **Lowercase matching:** For no-space variations (cmajor7, cminor7)
2. **Uppercase matching:** For spaced variations (C MAJOR7, C MINOR7)

### Priority Order
1. Minor 7th detection (before major 7th to avoid conflicts)
2. Major 7th detection
3. Half-diminished detection
4. Diminished detection
5. Minor detection
6. Major detection

## Testing

Run the test suite to verify all variations:
```bash
open test_chords.html
```

## Version History

- **v1.3.0:** Added comprehensive chord variation support
- **v1.2.0:** Basic chord normalization
- **v1.1.0:** Initial implementation

## Maintenance

When adding new chord variations:
1. Update this documentation
2. Add test cases to test_chords.html
3. Verify normalization in main.js
4. Test with various case combinations 