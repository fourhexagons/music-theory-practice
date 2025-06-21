# Release Format Guide

## Monome-Inspired Lean Format

### Template
- **Tag**: `vX.Y.Z-status` (semantic versioning + status)
- **Title**: `music-theory-practice YYMMDD-status` (product + date + status)
- **Pre-release**: ✅ Check for betas, ❌ Uncheck for finals
- **Description**: Lean bullet points only

### Description Template
```markdown
# YYMMDD-status

- NEW feature description
- FIX issue description  
- TEST coverage info
```

### Examples

#### Beta Release
- **Tag**: `v1.3.0-beta`
- **Title**: `music-theory-practice 250621-beta`
- **Pre-release**: ✅
- **Description**:
```markdown
# 250621-beta

- NEW chord normalization with case-sensitive pattern matching
- NEW accidental normalization for double accidentals and mixed notation
- NEW comprehensive test framework with keyboard shortcuts (Ctrl+Shift+Q)
- FIX chord quality detection conflicts between m7 and M7
- FIX delta symbol handling (Δ, ∆) for major 7th chords
- TEST 100% pass rate for all normalization functions
```

#### Final Release
- **Tag**: `v1.3.0`
- **Title**: `music-theory-practice 250628`
- **Pre-release**: ❌
- **Description**: Same format, remove `-beta` from date

### Rules
1. **Keep it lean** - No extra sections, just bullet points
2. **Use prefixes** - NEW, FIX, TEST only
3. **Date format** - YYMMDD (e.g., 250621 = June 21, 2025)
4. **Status suffixes** - `-beta`, `-rc`, `-alpha` as needed 