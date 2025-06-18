# Music Theory Practice App — Overview

## Purpose
A web app for practicing music theory fundamentals: key signatures, scales, triads, and seventh chords. Designed for fast, mobile-friendly, PWA-ready practice with local progress tracking.

## Quiz Stages (Phases)
- **acc**: Accidentals count (e.g., "How many accidentals in D major?")
- **scale**: Scale spelling (e.g., "Spell the D major scale")
- **triad**: Basic triad chords (e.g., "What chord is built on the 5th degree?")
- **triad+**: Advanced triad chords (randomized/complex triad questions)
- **7th**: Basic seventh chords
- **7th+**: Advanced seventh chords

## Developer Shortcuts (for Testing)
You can skip directly to any stage/key using a URL parameter:

```
?skip=CODE:KEY
```
Where:
- `CODE` is one of: `acc`, `scale`, `triad`, `triad+`, `7th`, `7th+`
- `KEY` is the key name (e.g., C, G, F#, Bb, etc.)

**Examples:**
- `?skip=acc:G` — Jump to accidentals count for G major
- `?skip=scale:D` — Jump to scale spelling for D major
- `?skip=triad:F#` — Jump to basic triad questions for F# major
- `?skip=triad+:Bb` — Jump to advanced triad questions for B♭ major
- `?skip=7th:E` — Jump to basic seventh chord questions for E major
- `?skip=7th+:Ab` — Jump to advanced seventh chord questions for A♭ major

## Directory Structure
- `cursor/` — Developer workspace root
  - `docs/` — Documentation (this file, etc.)
  - `images/` — Screenshots, diagrams, or reference images
  - `chats/` — Chat logs or AI session transcripts

**Note:** The previous `uploads/` directory has been replaced by `cursor/` and its internal directories.

---
For more details or to extend the app, see the main code in `public/js/main.js` and this documentation. 