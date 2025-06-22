/**
 * Music Theory Practice - Quiz Data Module
 * 
 * Contains all the music theory data for keys, scales, triads, and seventh chords.
 * This data is used by the question generation and answer checking logic.
 */

export const QUESTION_TYPES = {
  ACCIDENTALS_COUNT: 'accCount',
  ACCIDENTALS_NAMES: 'accNotes',
  SCALE_SPELLING: 'scale',
  TRIADS: 'triads',
  SEVENTHS: 'sevenths',
  SEVENTH_SPELLING: 'seventhSpelling'
};

export const MODES = {
  LINEAR: 'linear',
  RANDOM: 'random',
  ADVANCED_ALL: 'advanced',
  ADVANCED_SEVENTHS: 'advanced2'
};

export const quizData = {
  C: {
    accidentals: 0, 
    notes: [],
    scale: ["C","D","E","F","G","A","B"],
    triads: {2:"Dm",3:"Em",4:"F",5:"G",6:"Am",7:"B˚"},
    sevenths: {2:"Dm7",3:"Em7",4:"Fmaj7",5:"G7",6:"Am7",7:"Bm7♭5"},
    seventhSpelling: {2:["D","F","A","C"],3:["E","G","B","D"],4:["F","A","C","E"],5:["G","B","D","F"],6:["A","C","E","G"],7:["B","D","F","A"]}
  },
  G: {
    accidentals: 1, 
    notes: ["F#"],
    scale: ["G","A","B","C","D","E","F#"],
    triads: {2:"Am",3:"Bm",4:"C",5:"D",6:"Em",7:"F#˚"},
    sevenths: {2:"Am7",3:"Bm7",4:"Cmaj7",5:"D7",6:"Em7",7:"F#m7♭5"},
    seventhSpelling: {2:["A","C","E","G"],3:["B","D","F#","A"],4:["C","E","G","B"],5:["D","F#","A","C"],6:["E","G","B","D"],7:["F#","A","C","E"]}
  },
  D: {
    accidentals: 2, 
    notes: ["F#","C#"],
    scale: ["D","E","F#","G","A","B","C#"],
    triads: {2:"Em",3:"F#m",4:"G",5:"A",6:"Bm",7:"C#˚"},
    sevenths: {2:"Em7",3:"F#m7",4:"Gmaj7",5:"A7",6:"Bm7",7:"C#m7♭5"},
    seventhSpelling: {2:["E","G","B","D"],3:["F#","A","C#","E"],4:["G","B","D","F#"],5:["A","C#","E","G"],6:["B","D","F#","A"],7:["C#","E","G","B"]}
  },
  A: {
    accidentals: 3, 
    notes: ["F#","C#","G#"],
    scale: ["A","B","C#","D","E","F#","G#"],
    triads: {2:"Bm",3:"C#m",4:"D",5:"E",6:"F#m",7:"G#˚"},
    sevenths: {2:"Bm7",3:"C#m7",4:"Dmaj7",5:"E7",6:"F#m7",7:"G#m7♭5"},
    seventhSpelling: {2:["B","D","F#","A"],3:["C#","E","G#","B"],4:["D","F#","A","C#"],5:["E","G#","B","D"],6:["F#","A","C#","E"],7:["G#","B","D","F#"]}
  },
  E: {
    accidentals: 4, 
    notes: ["F#","C#","G#","D#"],
    scale: ["E","F#","G#","A","B","C#","D#"],
    triads: {2:"F#m",3:"G#m",4:"A",5:"B",6:"C#m",7:"D#˚"},
    sevenths: {2:"F#m7",3:"G#m7",4:"Amaj7",5:"B7",6:"C#m7",7:"D#m7♭5"},
    seventhSpelling: {2:["F#","A","C#","E"],3:["G#","B","D#","F#"],4:["A","C#","E","G#"],5:["B","D#","F#","A"],6:["C#","E","G#","B"],7:["D#","F#","A#","C#"]}
  },
  B: {
    accidentals: 5, 
    notes: ["F#","C#","G#","D#","A#"],
    scale: ["B","C#","D#","E","F#","G#","A#"],
    triads: {2:"C#m",3:"D#m",4:"E",5:"F#",6:"G#m",7:"A#˚"},
    sevenths: {2:"C#m7",3:"D#m7",4:"Emaj7",5:"F#7",6:"G#m7",7:"A#m7♭5"},
    seventhSpelling: {2:["C#","E","G#","B"],3:["D#","F#","A#","C#"],4:["E","G#","B","D#"],5:["F#","A#","C#","E"],6:["G#","B","D#","F#"],7:["A#","C#","E","G#"]}
  },
  "B♭": {
    accidentals: 2, 
    notes: ["B♭","E♭"],
    scale: ["B♭","C","D","E♭","F","G","A"],
    triads: {2:"Cm",3:"Dm",4:"E♭",5:"F",6:"Gm",7:"A˚"},
    sevenths: {2:"Cm7",3:"Dm7",4:"E♭maj7",5:"F7",6:"Gm7",7:"Am7♭5"},
    seventhSpelling: {2:["C","E♭","G","B♭"],3:["D","F","A","C"],4:["E♭","G","B♭","D"],5:["F","A","C","E♭"],6:["G","B♭","D","F"],7:["A","C","E♭","G"]}
  },
  "E♭": {
    accidentals: 3, 
    notes: ["B♭","E♭","A♭"],
    scale: ["E♭","F","G","A♭","B♭","C","D"],
    triads: {2:"Fm",3:"Gm",4:"A♭",5:"B♭",6:"Cm",7:"D˚"},
    sevenths: {2:"Fm7",3:"Gm7",4:"A♭maj7",5:"B♭7",6:"Cm7",7:"Dm7♭5"},
    seventhSpelling: {2:["F","A♭","C","E♭"],3:["G","B♭","D","F"],4:["A♭","C","E♭","G"],5:["B♭","D","F","A♭"],6:["C","E♭","G","B♭"],7:["D","F","A♭","C"]}
  },
  F: {
    accidentals: 1, 
    notes: ["B♭"],
    scale: ["F","G","A","B♭","C","D","E"],
    triads: {2:"Gm",3:"Am",4:"B♭",5:"C",6:"Dm",7:"E˚"},
    sevenths: {2:"Gm7",3:"Am7",4:"B♭maj7",5:"C7",6:"Dm7",7:"Em7♭5"},
    seventhSpelling: {2:["G","B♭","D","F"],3:["A","C","E","G"],4:["B♭","D","F","A"],5:["C","E","G","B♭"],6:["D","F","A","C"],7:["E","G","B♭","D"]}
  },
  "A♭": {
    accidentals: 4, 
    notes: ["B♭","E♭","A♭","D♭"],
    scale: ["A♭","B♭","C","D♭","E♭","F","G"],
    triads: {2:"B♭m",3:"Cm",4:"D♭",5:"E♭",6:"Fm",7:"G˚"},
    sevenths: {2:"B♭m7",3:"Cm7",4:"D♭maj7",5:"E♭7",6:"Fm7",7:"Gm7♭5"},
    seventhSpelling: {2:["B♭","D♭","F","A♭"],3:["C","E♭","G","B♭"],4:["D♭","F","A♭","C"],5:["E♭","G","B♭","D♭"],6:["F","A♭","C","E♭"],7:["G","B♭","D♭","F"]}
  },
  "D♭": {
    accidentals: 5, 
    notes: ["B♭","E♭","A♭","D♭","G♭"],
    scale: ["D♭","E♭","F","G♭","A♭","B♭","C"],
    triads: {2:"E♭m",3:"Fm",4:"G♭",5:"A♭",6:"B♭m",7:"C˚"},
    sevenths: {2:"E♭m7",3:"Fm7",4:"G♭maj7",5:"A♭7",6:"B♭m7",7:"Cm7♭5"},
    seventhSpelling: {2:["E♭","G♭","B♭","D♭"],3:["F","A♭","C","E♭"],4:["G♭","B♭","D♭","F"],5:["A♭","C","E♭","G♭"],6:["B♭","D♭","F","A♭"],7:["C","E♭","G♭","B♭"]}
  },
  "F♯": {
    accidentals: 6, 
    notes: ["F#","C#","G#","D#","A#","E#"],
    scale: ["F#","G#","A#","B","C#","D#","E#"],
    triads: {2:"G#m",3:"A#m",4:"B",5:"C#",6:"D#m",7:"E#˚"},
    sevenths: {2:"G#m7",3:"A#m7",4:"Bmaj7",5:"C#7",6:"D#m7",7:"E#m7♭5"},
    seventhSpelling: {2:["G#","B","D#","F#"],3:["A#","C#","E#","G#"],4:["B","D#","F#","A#"],5:["C#","E#","G#","B"],6:["D#","F#","A#","C#"],7:["E#","G#","B","D#"]}
  },
  "G♭": {
    accidentals: 6, 
    notes: ["B♭","E♭","A♭","D♭","G♭","C♭"],
    scale: ["G♭","A♭","B♭","C♭","D♭","E♭","F"],
    triads: {2:"A♭m",3:"B♭m",4:"C♭",5:"D♭",6:"E♭m",7:"F˚"},
    sevenths: {2:"A♭m7",3:"B♭m7",4:"C♭maj7",5:"D♭7",6:"E♭m7",7:"Fm7♭5"},
    seventhSpelling: {2:["A♭","C♭","E♭","G♭"],3:["B♭","D♭","F","A♭"],4:["C♭","E♭","G♭","B♭"],5:["D♭","F","A♭","C♭"],6:["E♭","G♭","B♭","D♭"],7:["F","A♭","C♭","E♭"]}
  }
};

export const orderedKeys = ['F♯', 'B', 'E', 'A', 'D', 'G', 'C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'];
export const allKeys = Object.keys(quizData);

export const learningPath = {
  groups: [
    { name: 'Accidentals Count', keys: allKeys, mode: MODES.LINEAR },
    { name: 'Accidentals Names', keys: allKeys, mode: MODES.LINEAR },
    { name: 'Scale Spelling', keys: allKeys, mode: MODES.LINEAR },
    { name: 'Triads', keys: allKeys, mode: MODES.LINEAR },
    { name: 'Sevenths', keys: allKeys, mode: MODES.LINEAR },
    { name: 'Seventh Spelling', keys: allKeys, mode: MODES.LINEAR },
    { name: 'Randomize', keys: allKeys, mode: MODES.ADVANCED_ALL },
    { name: 'Seventh Spelling', keys: allKeys, mode: MODES.ADVANCED_SEVENTHS }
  ],
  chapters: [
    { id: QUESTION_TYPES.ACCIDENTALS_COUNT, name: 'Accidentals Count' },
    { id: QUESTION_TYPES.ACCIDENTALS_NAMES, name: 'Accidentals Naming' },
    { id: QUESTION_TYPES.SCALE_SPELLING, name: 'Scale Spelling' },
    { id: QUESTION_TYPES.TRIADS, name: 'Triads' },
    { id: QUESTION_TYPES.SEVENTHS, name: 'Sevenths' },
    { id: QUESTION_TYPES.SEVENTH_SPELLING, name: 'Seventh Spelling' }
  ]
}; 