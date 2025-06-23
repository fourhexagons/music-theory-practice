// This file contains the core data for the music theory quiz.

window.quizData = {
    "C": {
        "accidentals": 0, "notes": [], "scale": ["C", "D", "E", "F", "G", "A", "B"],
        "triads": { "1": "C", "2": "Dm", "3": "Em", "4": "F", "5": "G", "6": "Am", "7": "B°" },
        "sevenths": { "1": "Cmaj7", "2": "Dm7", "3": "Em7", "4": "Fmaj7", "5": "G7", "6": "Am7", "7": "Bm7♭5" },
        "seventhSpelling": { "1": ["C", "E", "G", "B"], "2": ["D", "F", "A", "C"], "3": ["E", "G", "B", "D"], "4": ["F", "A", "C", "E"], "5": ["G", "B", "D", "F"], "6": ["A", "C", "E", "G"], "7": ["B", "D", "F", "A"] }
    },
    "G": {
        "accidentals": 1, "notes": ["F#"], "scale": ["G", "A", "B", "C", "D", "E", "F#"],
        "triads": { "1": "G", "2": "Am", "3": "Bm", "4": "C", "5": "D", "6": "Em", "7": "F#°" },
        "sevenths": { "1": "Gmaj7", "2": "Am7", "3": "Bm7", "4": "Cmaj7", "5": "D7", "6": "Em7", "7": "F#m7♭5" },
        "seventhSpelling": { "1": ["G", "B", "D", "F#"], "2": ["A", "C", "E", "G"], "3": ["B", "D", "F#", "A"], "4": ["C", "E", "G", "B"], "5": ["D", "F#", "A", "C"], "6": ["E", "G", "B", "D"], "7": ["F#", "A", "C", "E"] }
    },
    "D": {
        "accidentals": 2, "notes": ["F#", "C#"], "scale": ["D", "E", "F#", "G", "A", "B", "C#"],
        "triads": { "1": "D", "2": "Em", "3": "F#m", "4": "G", "5": "A", "6": "Bm", "7": "C#°" },
        "sevenths": { "1": "Dmaj7", "2": "Em7", "3": "F#m7", "4": "Gmaj7", "5": "A7", "6": "Bm7", "7": "C#m7♭5" },
        "seventhSpelling": { "1": ["D", "F#", "A", "C#"], "2": ["E", "G", "B", "D"], "3": ["F#", "A", "C#", "E"], "4": ["G", "B", "D", "F#"], "5": ["A", "C#", "E", "G"], "6": ["B", "D", "F#", "A"], "7": ["C#", "E", "G", "B"] }
    },
    "A": {
        "accidentals": 3, "notes": ["F#", "C#", "G#"], "scale": ["A", "B", "C#", "D", "E", "F#", "G#"],
        "triads": { "1": "A", "2": "Bm", "3": "C#m", "4": "D", "5": "E", "6": "F#m", "7": "G#°" },
        "sevenths": { "1": "Amaj7", "2": "Bm7", "3": "C#m7", "4": "Dmaj7", "5": "E7", "6": "F#m7", "7": "G#m7♭5" },
        "seventhSpelling": { "1": ["A", "C#", "E", "G#"], "2": ["B", "D", "F#", "A"], "3": ["C#", "E", "G#", "B"], "4": ["D", "F#", "A", "C#"], "5": ["E", "G#", "B", "D"], "6": ["F#", "A", "C#", "E"], "7": ["G#", "B", "D", "F#"] }
    },
    "E": {
        "accidentals": 4, "notes": ["F#", "C#", "G#", "D#"], "scale": ["E", "F#", "G#", "A", "B", "C#", "D#"],
        "triads": { "1": "E", "2": "F#m", "3": "G#m", "4": "A", "5": "B", "6": "C#m", "7": "D#°" },
        "sevenths": { "1": "Emaj7", "2": "F#m7", "3": "G#m7", "4": "Amaj7", "5": "B7", "6": "C#m7", "7": "D#m7♭5" },
        "seventhSpelling": { "1": ["E", "G#", "B", "D#"], "2": ["F#", "A", "C#", "E"], "3": ["G#", "B", "D#", "F#"], "4": ["A", "C#", "E", "G#"], "5": ["B", "D#", "F#", "A"], "6": ["C#", "E", "G#", "B"], "7": ["D#", "F#", "A", "C#"] }
    },
    "B": {
        "accidentals": 5, "notes": ["F#", "C#", "G#", "D#", "A#"], "scale": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
        "triads": { "1": "B", "2": "C#m", "3": "D#m", "4": "E", "5": "F#", "6": "G#m", "7": "A#°" },
        "sevenths": { "1": "Bmaj7", "2": "C#m7", "3": "D#m7", "4": "Emaj7", "5": "F#7", "6": "G#m7", "7": "A#m7♭5" },
        "seventhSpelling": { "1": ["B", "D#", "F#", "A#"], "2": ["C#", "E", "G#", "B"], "3": ["D#", "F#", "A#", "C#"], "4": ["E", "G#", "B", "D#"], "5": ["F#", "A#", "C#", "E"], "6": ["G#", "B", "D#", "F#"], "7": ["A#", "C#", "E", "G#"] }
    },
    "F#": {
        "accidentals": 6, "notes": ["F#", "C#", "G#", "D#", "A#", "E#"], "scale": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
        "triads": { "1": "F#", "2": "G#m", "3": "A#m", "4": "B", "5": "C#", "6": "D#m", "7": "E#°" },
        "sevenths": { "1": "F#maj7", "2": "G#m7", "3": "A#m7", "4": "Bmaj7", "5": "C#7", "6": "D#m7", "7": "E#m7♭5" },
        "seventhSpelling": { "1": ["F#", "A#", "C#", "E#"], "2": ["G#", "B", "D#", "F#"], "3": ["A#", "C#", "E#", "G#"], "4": ["B", "D#", "F#", "A#"], "5": ["C#", "E#", "G#", "B"], "6": ["D#", "F#", "A#", "C#"], "7": ["E#", "G#", "B", "D#"] }
    },
    "C#": {
        "accidentals": 7, "notes": ["F#", "C#", "G#", "D#", "A#", "E#", "B#"], "scale": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
        "triads": { "1": "C#", "2": "D#m", "3": "E#m", "4": "F#", "5": "G#", "6": "A#m", "7": "B#°" },
        "sevenths": { "1": "C#maj7", "2": "D#m7", "3": "E#m7", "4": "F#maj7", "5": "G#7", "6": "A#m7", "7": "B#m7♭5" },
        "seventhSpelling": { "1": ["C#", "E#", "G#", "B#"], "2": ["D#", "F#", "A#", "C#"], "3": ["E#", "G#", "B#", "D#"], "4": ["F#", "A#", "C#", "E#"], "5": ["G#", "B#", "D#", "F#"], "6": ["A#", "C#", "E#", "G#"], "7": ["B#", "D#", "F#", "A#"] }
    },
    "F": {
        "accidentals": 1, "notes": ["Bb"], "scale": ["F", "G", "A", "Bb", "C", "D", "E"],
        "triads": { "1": "F", "2": "Gm", "3": "Am", "4": "Bb", "5": "C", "6": "Dm", "7": "E°" },
        "sevenths": { "1": "Fmaj7", "2": "Gm7", "3": "Am7", "4": "Bbmaj7", "5": "C7", "6": "Dm7", "7": "Em7♭5" },
        "seventhSpelling": { "1": ["F", "A", "C", "E"], "2": ["G", "Bb", "D", "F"], "3": ["A", "C", "E", "G"], "4": ["Bb", "D", "F", "A"], "5": ["C", "E", "G", "Bb"], "6": ["D", "F", "A", "C"], "7": ["E", "G", "Bb", "D"] }
    },
    "Bb": {
        "accidentals": 2, "notes": ["Bb", "Eb"], "scale": ["Bb", "C", "D", "Eb", "F", "G", "A"],
        "triads": { "1": "Bb", "2": "Cm", "3": "Dm", "4": "Eb", "5": "F", "6": "Gm", "7": "A°" },
        "sevenths": { "1": "Bbmaj7", "2": "Cm7", "3": "Dm7", "4": "Ebmaj7", "5": "F7", "6": "Gm7", "7": "Am7♭5" },
        "seventhSpelling": { "1": ["Bb", "D", "F", "A"], "2": ["C", "Eb", "G", "Bb"], "3": ["D", "F", "A", "C"], "4": ["Eb", "G", "Bb", "D"], "5": ["F", "A", "C", "Eb"], "6": ["G", "Bb", "D", "F"], "7": ["A", "C", "Eb", "G"] }
    },
    "Eb": {
        "accidentals": 3, "notes": ["Bb", "Eb", "Ab"], "scale": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
        "triads": { "1": "Eb", "2": "Fm", "3": "Gm", "4": "Ab", "5": "Bb", "6": "Cm", "7": "D°" },
        "sevenths": { "1": "Ebmaj7", "2": "Fm7", "3": "Gm7", "4": "Abmaj7", "5": "Bb7", "6": "Cm7", "7": "Dm7♭5" },
        "seventhSpelling": { "1": ["Eb", "G", "Bb", "D"], "2": ["F", "Ab", "C", "Eb"], "3": ["G", "Bb", "D", "F"], "4": ["Ab", "C", "Eb", "G"], "5": ["Bb", "D", "F", "Ab"], "6": ["C", "Eb", "G", "Bb"], "7": ["D", "F", "Ab", "C"] }
    },
    "Ab": {
        "accidentals": 4, "notes": ["Bb", "Eb", "Ab", "Db"], "scale": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
        "triads": { "1": "Ab", "2": "Bbm", "3": "Cm", "4": "Db", "5": "Eb", "6": "Fm", "7": "G°" },
        "sevenths": { "1": "Abmaj7", "2": "Bbm7", "3": "Cm7", "4": "Dbmaj7", "5": "Eb7", "6": "Fm7", "7": "Gm7♭5" },
        "seventhSpelling": { "1": ["Ab", "C", "Eb", "G"], "2": ["Bb", "Db", "F", "Ab"], "3": ["C", "Eb", "G", "Bb"], "4": ["Db", "F", "Ab", "C"], "5": ["Eb", "G", "Bb", "Db"], "6": ["F", "Ab", "C", "Eb"], "7": ["G", "Bb", "Db", "F"] }
    },
    "Db": {
        "accidentals": 5, "notes": ["Bb", "Eb", "Ab", "Db", "Gb"], "scale": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
        "triads": { "1": "Db", "2": "Ebm", "3": "Fm", "4": "Gb", "5": "Ab", "6": "Bbm", "7": "C°" },
        "sevenths": { "1": "Dbmaj7", "2": "Ebm7", "3": "Fm7", "4": "Gbmaj7", "5": "Ab7", "6": "Bbm7", "7": "Cm7♭5" },
        "seventhSpelling": { "1": ["Db", "F", "Ab", "C"], "2": ["Eb", "Gb", "Bb", "Db"], "3": ["F", "Ab", "C", "Eb"], "4": ["Gb", "Bb", "Db", "F"], "5": ["Ab", "C", "Eb", "Gb"], "6": ["Bb", "Db", "F", "Ab"], "7": ["C", "Eb", "Gb", "Bb"] }
    },
    "Gb": {
        "accidentals": 6, "notes": ["Bb", "Eb", "Ab", "Db", "Gb", "Cb"], "scale": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
        "triads": { "1": "Gb", "2": "Abm", "3": "Bbm", "4": "Cb", "5": "Db", "6": "Ebm", "7": "F°" },
        "sevenths": { "1": "Gbmaj7", "2": "Abm7", "3": "Bbm7", "4": "Cbmaj7", "5": "Db7", "6": "Ebm7", "7": "Fm7♭5" },
        "seventhSpelling": { "1": ["Gb", "Bb", "Db", "F"], "2": ["Ab", "Cb", "Eb", "Gb"], "3": ["Bb", "Db", "F", "Ab"], "4": ["Cb", "Eb", "Gb", "Bb"], "5": ["Db", "F", "Ab", "Cb"], "6": ["Eb", "Gb", "Bb", "Db"], "7": ["F", "Ab", "Cb", "Eb"] }
    },
    "Cb": {
        "accidentals": 7, "notes": ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"], "scale": ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
        "triads": { "1": "Cb", "2": "Dbm", "3": "Ebm", "4": "Fb", "5": "Gb", "6": "Abm", "7": "Bb°" },
        "sevenths": { "1": "Cbmaj7", "2": "Dbm7", "3": "Ebm7", "4": "Fbmaj7", "5": "Gb7", "6": "Abm7", "7": "Bbm7♭5" },
        "seventhSpelling": { "1": ["Cb", "Eb", "Gb", "Bb"], "2": ["Db", "Fb", "Ab", "Cb"], "3": ["Eb", "Gb", "Bb", "Db"], "4": ["Fb", "Ab", "Cb", "Eb"], "5": ["Gb", "Bb", "Db", "Fb"], "6": ["Ab", "Cb", "Eb", "Gb"], "7": ["Bb", "Db", "Fb", "Ab"] }
    }
};

window.orderedKeys = ['F♯', 'B', 'E', 'A', 'D', 'G', 'C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'];
window.allKeys = Object.keys(window.quizData);

window.QUESTION_TYPES = {
    ACCIDENTALS_COUNT: 'accCount',
    ACCIDENTALS_NAMES: 'accNotes',
    SCALE_SPELLING: 'scale',
    TRIADS: 'triads',
    SEVENTHS: 'sevenths',
    SEVENTH_SPELLING: 'seventhSpelling'
};

window.MODES = {
    LINEAR: 'linear',
    RANDOM_KEYS_LINEAR_CHAPTERS: 'random_keys_linear_chapters',
    RANDOM_ALL: 'random_all',
    COMPLETE: 'complete'
};

window.CHAPTERS = {
    ACCIDENTALS_COUNT: { id: window.QUESTION_TYPES.ACCIDENTALS_COUNT, name: 'Accidentals Count' },
    ACCIDENTALS_NAMES: { id: window.QUESTION_TYPES.ACCIDENTALS_NAMES, name: 'Accidentals Naming' },
    SCALE_SPELLING: { id: window.QUESTION_TYPES.SCALE_SPELLING, name: 'Scale Spelling' },
    TRIADS: { id: window.QUESTION_TYPES.TRIADS, name: 'Triads' },
    SEVENTHS: { id: window.QUESTION_TYPES.SEVENTHS, name: 'Sevenths' },
    SEVENTH_SPELLING: { id: window.QUESTION_TYPES.SEVENTH_SPELLING, name: 'Seventh Spelling' }
};

const CORE_CHAPTERS = [window.CHAPTERS.ACCIDENTALS_COUNT, window.CHAPTERS.ACCIDENTALS_NAMES, window.CHAPTERS.SCALE_SPELLING, window.CHAPTERS.TRIADS];
const ALL_CHAPTERS = Object.values(window.CHAPTERS);

window.learningPath = [
    { name: '1. Introduction', keys: ['C'], mode: window.MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '2. Level 1a Sharps', keys: ['G', 'D', 'A'], mode: window.MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '3. Level 1b Sharps', keys: ['G', 'D', 'A'], mode: window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '4. Level 1a Flats', keys: ['F', 'B♭', 'E♭'], mode: window.MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '5. Level 1b Flats', keys: ['F', 'B♭', 'E♭'], mode: window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '6. Level 2a Sharps', keys: ['E', 'B', 'F♯'], mode: window.MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '7. Level 2b Sharps', keys: ['E', 'B', 'F♯'], mode: window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '8. Level 2a Flats', keys: ['A♭', 'D♭', 'G♭'], mode: window.MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '9. Level 2b Flats', keys: ['A♭', 'D♭', 'G♭'], mode: window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '10. Level 3 Sharps', keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F♯'], mode: window.MODES.RANDOM_ALL, chapters: ALL_CHAPTERS, requiredStreak: 5 },
    { name: '11. Level 3 Flats', keys: ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'], mode: window.MODES.RANDOM_ALL, chapters: ALL_CHAPTERS, requiredStreak: 5 },
    { name: 'Complete!', keys: [], mode: window.MODES.COMPLETE, chapters: [], requiredStreak: Infinity }
];