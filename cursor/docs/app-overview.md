# Music Theory Practice App — Overview

## App Function
A progressive web app for practicing music theory: key signatures, scales, triads, and seventh chords. Designed for mobile and desktop, with local progress tracking, modern UI, and PWA support.

## Quiz Stages
- **Accidentals Count**: How many accidentals in the key?  
- **Accidentals Naming**: Name the accidentals in the key.  
- **Scale Spelling**: Spell the major scale.  
- **Triads**: Identify triads by scale degree.  
- **Advanced Triads**: Random triad questions across all keys. 
- **Sevenths**: Identify seventh chords by scale degree.  
- **Advanced Sevenths**: Random seventh chord questions across all keys.  

## Skip/Jump Shortcuts (for Devs/Testing)
You can jump to any stage/key using the `?skip=` URL parameter with the following syntax:

- `?skip=G` — Jump to accidentals count for G major  
- `?skip=D-scale` — Jump to scale spelling for D major  
- `?skip=F#-triad` — Jump to basic triad questions for F# major  
- `?skip=Bb-triad+` — Jump to advanced triad questions for B♭ major  
- `?skip=E-7th` — Jump to basic seventh chord questions for E major  
- `?skip=Ab-7th+` — Jump to advanced seventh chord questions for A♭ major  

**Supported phases:**
- `scale` — Major scale spelling  
- `triad` — Basic triad questions  
- `triad+` — Advanced triad questions  
- `7th` — Basic seventh chord questions  
- `7th+` — Advanced seventh chord questions  

**Key names:**  
- Use `b` for flat (e.g., `Bb`, `Ab`)  
- Use `#` for sharp (e.g., `F#`, `C#`)  
- Both ASCII and Unicode accidentals are supported (e.g., `Bb` or `B♭`).  

**Examples:**  
- `?skip=G` (G major accidentals count)  
- `?skip=Eb-scale` (E♭ major scale spelling)  
- `?skip=F#-triad` (F♯ major triads)  
- `?skip=Bb-triad+` (B♭ major advanced triads)  
- `?skip=E-7th` (E major sevenths)  
- `?skip=Ab-7th+` (A♭ major advanced sevenths)  

## Directory Structure
- `public/` — Static assets, HTML, CSS, JS, icons  
- `cursor/docs/` — Project documentation (this file, etc.)  
- `cursor/images/` — App images and logos  
- `cursor/chats/` — AI/agent chat logs (if used)  

## Progress Tracking
- Progress is saved in localStorage (unless in Beginner mode, which resets on reload)  
- Dev/Teacher profile unlocks all keys for instant access/testing  

## PWA & Service Worker
- App is installable and works offline  
- If you encounter caching issues during development, unregister the service worker and clear site data in DevTools  

---
For more details or to extend the app, see the code in `public/js/main.js` and this documentation. 