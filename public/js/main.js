console.log('main.js loaded');

// --- 1. Constants and Data ---

const QUESTION_TYPES = {
  ACCIDENTALS_COUNT: 'accCount',
  ACCIDENTALS_NAMES: 'accNotes',
  SCALE_SPELLING: 'scale',
  TRIADS: 'triads',
  SEVENTHS: 'sevenths',
  SEVENTH_SPELLING: 'seventhSpelling'
};

const MODES = {
  LINEAR: 'linear',
  RANDOM_KEYS_LINEAR_CHAPTERS: 'random_keys_linear_chapters',
  RANDOM_ALL: 'random_all',
  COMPLETE: 'complete'
};

const quizData = {
  C: {
    accidentals:0, notes:[],
    scale:["C","D","E","F","G","A","B"],
    triads:{2:"Dm",3:"Em",4:"F",5:"G",6:"Am",7:"B˚"},
    sevenths:{2:"Dm7",3:"Em7",4:"Fmaj7",5:"G7",6:"Am7",7:"Bm7♭5"},
    seventhSpelling:{2:["D","F","A","C"],3:["E","G","B","D"],4:["F","A","C","E"],5:["G","B","D","F"],6:["A","C","E","G"],7:["B","D","F","A"]}
  },
  G: {
    accidentals:1, notes:["F#"],
    scale:["G","A","B","C","D","E","F#"],
    triads:{2:"Am",3:"Bm",4:"C",5:"D",6:"Em",7:"F#˚"},
    sevenths:{2:"Am7",3:"Bm7",4:"Cmaj7",5:"D7",6:"Em7",7:"F#m7♭5"},
    seventhSpelling:{2:["A","C","E","G"],3:["B","D","F#","A"],4:["C","E","G","B"],5:["D","F#","A","C"],6:["E","G","B","D"],7:["F#","A","C","E"]}
  },
  D: {
    accidentals:2, notes:["F#","C#"],
    scale:["D","E","F#","G","A","B","C#"],
    triads:{2:"Em",3:"F#m",4:"G",5:"A",6:"Bm",7:"C#˚"},
    sevenths:{2:"Em7",3:"F#m7",4:"Gmaj7",5:"A7",6:"Bm7",7:"C#m7♭5"},
    seventhSpelling:{2:["E","G","B","D"],3:["F#","A","C#","E"],4:["G","B","D","F#"],5:["A","C#","E","G"],6:["B","D","F#","A"],7:["C#","E","G","B"]}
  },
  A: {
    accidentals:3, notes:["F#","C#","G#"],
    scale:["A","B","C#","D","E","F#","G#"],
    triads:{2:"Bm",3:"C#m",4:"D",5:"E",6:"F#m",7:"G#˚"},
    sevenths:{2:"Bm7",3:"C#m7",4:"Dmaj7",5:"E7",6:"F#m7",7:"G#m7♭5"},
    seventhSpelling:{2:["B","D","F#","A"],3:["C#","E","G#","B"],4:["D","F#","A","C#"],5:["E","G#","B","D"],6:["F#","A","C#","E"],7:["G#","B","D","F#"]}
  },
  E: {
    accidentals:4, notes:["F#","C#","G#","D#"],
    scale:["E","F#","G#","A","B","C#","D#"],
    triads:{2:"F#m",3:"G#m",4:"A",5:"B",6:"C#m",7:"D#˚"},
    sevenths:{2:"F#m7",3:"G#m7",4:"Amaj7",5:"B7",6:"C#m7",7:"D#m7♭5"},
    seventhSpelling:{2:["F#","A","C#","E"],3:["G#","B","D#","F#"],4:["A","C#","E","G#"],5:["B","D#","F#","A"],6:["C#","E","G#","B"],7:["D#","F#","A#","C#"]}
  },
  B: {
    accidentals:5, notes:["F#","C#","G#","D#","A#"],
    scale:["B","C#","D#","E","F#","G#","A#"],
    triads:{2:"C#m",3:"D#m",4:"E",5:"F#",6:"G#m",7:"A#˚"},
    sevenths:{2:"C#m7",3:"D#m7",4:"Emaj7",5:"F#7",6:"G#m7",7:"A#m7♭5"},
    seventhSpelling:{2:["C#","E","G#","B"],3:["D#","F#","A#","C#"],4:["E","G#","B","D#"],5:["F#","A#","C#","E"],6:["G#","B","D#","F#"],7:["A#","C#","E","G#"]}
  },
  "B♭": {
    accidentals:2, notes:["B♭","E♭"],
    scale:["B♭","C","D","E♭","F","G","A"],
    triads:{2:"Cm",3:"Dm",4:"E♭",5:"F",6:"Gm",7:"A˚"},
    sevenths:{2:"Cm7",3:"Dm7",4:"E♭maj7",5:"F7",6:"Gm7",7:"Am7♭5"},
    seventhSpelling:{2:["C","E♭","G","B♭"],3:["D","F","A","C"],4:["E♭","G","B♭","D"],5:["F","A","C","E♭"],6:["G","B♭","D","F"],7:["A","C","E♭","G"]}
  },
  "E♭": {
    accidentals:3, notes:["B♭","E♭","A♭"],
    scale:["E♭","F","G","A♭","B♭","C","D"],
    triads:{2:"Fm",3:"Gm",4:"A♭",5:"B♭",6:"Cm",7:"D˚"},
    sevenths:{2:"Fm7",3:"Gm7",4:"A♭maj7",5:"B♭7",6:"Cm7",7:"Dm7♭5"},
    seventhSpelling:{2:["F","A♭","C","E♭"],3:["G","B♭","D","F"],4:["A♭","C","E♭","G"],5:["B♭","D","F","A♭"],6:["C","E♭","G","B♭"],7:["D","F","A♭","C"]}
  },
  F: {
    accidentals:1, notes:["B♭"],
    scale:["F","G","A","B♭","C","D","E"],
    triads:{2:"Gm",3:"Am",4:"B♭",5:"C",6:"Dm",7:"E˚"},
    sevenths:{2:"Gm7",3:"Am7",4:"B♭maj7",5:"C7",6:"Dm7",7:"Em7♭5"},
    seventhSpelling:{2:["G","B♭","D","F"],3:["A","C","E","G"],4:["B♭","D","F","A"],5:["C","E","G","B♭"],6:["D","F","A","C"],7:["E","G","B♭","D"]}
  },
  "A♭": {
    accidentals:4, notes:["B♭","E♭","A♭","D♭"],
    scale:["A♭","B♭","C","D♭","E♭","F","G"],
    triads:{2:"B♭m",3:"Cm",4:"D♭",5:"E♭",6:"Fm",7:"G˚"},
    sevenths:{2:"B♭m7",3:"Cm7",4:"D♭maj7",5:"E♭7",6:"Fm7",7:"Gm7♭5"},
    seventhSpelling:{2:["B♭","D♭","F","A♭"],3:["C","E♭","G","B♭"],4:["D♭","F","A♭","C"],5:["E♭","G","B♭","D♭"],6:["F","A♭","C","E♭"],7:["G","B♭","D♭","F"]}
  },
  "D♭": {
    accidentals:5, notes:["B♭","E♭","A♭","D♭","G♭"],
    scale:["D♭","E♭","F","G♭","A♭","B♭","C"],
    triads:{2:"E♭m",3:"Fm",4:"G♭",5:"A♭",6:"B♭m",7:"C˚"},
    sevenths:{2:"E♭m7",3:"Fm7",4:"G♭maj7",5:"A♭7",6:"B♭m7",7:"Cm7♭5"},
    seventhSpelling:{2:["E♭","G♭","B♭","D♭"],3:["F","A♭","C","E♭"],4:["G♭","B♭","D♭","F"],5:["A♭","C","E♭","G♭"],6:["B♭","D♭","F","A♭"],7:["C","E♭","G♭","B♭"]}
  },
  "F♯": {
    accidentals:6, notes:["F#","C#","G#","D#","A#","E#"],
    scale:["F#","G#","A#","B","C#","D#","E#"],
    triads:{2:"G#m",3:"A#m",4:"B",5:"C#",6:"D#m",7:"E#˚"},
    sevenths:{2:"G#m7",3:"A#m7",4:"Bmaj7",5:"C#7",6:"D#m7",7:"E#m7♭5"},
    seventhSpelling:{2:["G#","B","D#","F#"],3:["A#","C#","E#","G#"],4:["B","D#","F#","A#"],5:["C#","E#","G#","B"],6:["D#","F#","A#","C#"],7:["E#","G#","B","D#"]}
  },
  "G♭": {
    accidentals:6, notes:["B♭","E♭","A♭","D♭","G♭","C♭"],
    scale:["G♭","A♭","B♭","C♭","D♭","E♭","F"],
    triads:{2:"A♭m",3:"B♭m",4:"C♭",5:"D♭",6:"E♭m",7:"F˚"},
    sevenths:{2:"A♭m7",3:"B♭m7",4:"C♭maj7",5:"D♭7",6:"E♭m7",7:"Fm7♭5"},
    seventhSpelling:{2:["A♭","C♭","E♭","G♭"],3:["B♭","D♭","F","A♭"],4:["C♭","E♭","G♭","B♭"],5:["D♭","F","A♭","C♭"],6:["E♭","G♭","B♭","D♭"],7:["F","A♭","C♭","E♭"]}
  }
};

const allKeys = Object.keys(quizData);

const CHAPTERS = {
  ACCIDENTALS_COUNT: { id: QUESTION_TYPES.ACCIDENTALS_COUNT, name: 'Accidentals Count' },
  ACCIDENTALS_NAMES: { id: QUESTION_TYPES.ACCIDENTALS_NAMES, name: 'Accidentals Naming' },
  SCALE_SPELLING: { id: QUESTION_TYPES.SCALE_SPELLING, name: 'Scale Spelling' },
  TRIADS: { id: QUESTION_TYPES.TRIADS, name: 'Triads' },
  SEVENTHS: { id: QUESTION_TYPES.SEVENTHS, name: 'Sevenths' },
  SEVENTH_SPELLING: { id: QUESTION_TYPES.SEVENTH_SPELLING, name: 'Seventh Spelling' }
};

const CORE_CHAPTERS = [CHAPTERS.ACCIDENTALS_COUNT, CHAPTERS.ACCIDENTALS_NAMES, CHAPTERS.SCALE_SPELLING, CHAPTERS.TRIADS];
const ALL_CHAPTERS = Object.values(CHAPTERS);

const learningPath = [
    { name: '1. Introduction', keys: ['C'], mode: MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '2. Level 1a Sharps', keys: ['G', 'D', 'A'], mode: MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '3. Level 1b Sharps', keys: ['G', 'D', 'A'], mode: MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '4. Level 1a Flats', keys: ['F', 'B♭', 'E♭'], mode: MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '5. Level 1b Flats', keys: ['F', 'B♭', 'E♭'], mode: MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '6. Level 2a Sharps', keys: ['E', 'B', 'F♯'], mode: MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '7. Level 2b Sharps', keys: ['E', 'B', 'F♯'], mode: MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '8. Level 2a Flats', keys: ['A♭', 'D♭', 'G♭'], mode: MODES.LINEAR, chapters: CORE_CHAPTERS, requiredStreak: 3 },
    { name: '9. Level 2b Flats', keys: ['A♭', 'D♭', 'G♭'], mode: MODES.RANDOM_KEYS_LINEAR_CHAPTERS, chapters: CORE_CHAPTERS, requiredStreak: 5 },
    { name: '10. Level 3 Sharps', keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F♯'], mode: MODES.RANDOM_ALL, chapters: ALL_CHAPTERS, requiredStreak: 5 },
    { name: '11. Level 3 Flats', keys: ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'], mode: MODES.RANDOM_ALL, chapters: ALL_CHAPTERS, requiredStreak: 5 },
    { name: 'Complete!', keys: [], mode: MODES.COMPLETE, chapters: [], requiredStreak: Infinity }
];

const learningState = {
  currentLevelIndex: 0,
  currentChapterIndex: 0,
  currentKeyIndex: 0,
  correctAnswerStreak: 0,
  currentQuestion: null,
  lastAnswerIncorrect: false,
  usedDegrees: [],
  isAdvancedMode: false,
  advancedModeType: null,
  correctChordAnswersForCurrentKey: 0,
  waitingForAccidentalsNaming: false,
  lastAccidentalsKey: null,
};


// --- 2. Utility Functions ---

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function wordToNumber(word) {
  const numberWords = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
  };
  return numberWords[word.toLowerCase()] !== undefined ? numberWords[word.toLowerCase()] : null;
}

function normalizeChord(raw) {
  if (!raw) return "";
  let normalized = raw.trim();

  // Check if this is a note spelling (space-separated notes like "C# E G# B")
  const noteSpellingMatch = normalized.match(/^([A-Ga-g][#♯b♭]?)\s+([A-Ga-g][#♯b♭]?)\s+([A-Ga-g][#♯b♭]?)(?:\s+([A-Ga-g][#♯b♭]?))?$/);
  if (noteSpellingMatch) {
    // This is a note spelling, return the root note
    const rootNote = accidentalToUnicode(noteSpellingMatch[1]);
    return rootNote;
  }

  // Remove all spaces for normalization
  normalized = normalized.replace(/\s+/g, "");

  // Validate that the input starts with a valid note letter (A-G)
  if (!/^[A-Ga-g]/.test(normalized)) {
    return "";
  }

  // Normalize the note names (handle accidentals) BEFORE case conversion
  const noteMatch = normalized.match(/^([A-Ga-g])([#♯b♭]*)(.*)$/);
  if (!noteMatch) return "";
  const [, baseNote, accidentals, rest] = noteMatch;
  const normalizedNote = accidentalToUnicode(baseNote + accidentals);
  let chordPart = rest;

  // Apply multi-token rules FIRST (before single-token rules)
  const multiTokenRules = [
    { pattern: /^(major|maj|M)[\s\-]?7$/i, replacement: 'maj7' },
    { pattern: /^(minor|min|m)[\s\-]?7$/i, replacement: 'm7' },
    { pattern: /^(dominant|dom)[\s\-]?7$/i, replacement: '7' },
    { pattern: /^(half[\s\-]?dim|halfdiminished|ø)[\s\-]?7$/i, replacement: 'm7♭5' },
    { pattern: /^(dim|diminished|o|°|˚)[\s\-]?7$/i, replacement: '˚7' },
    { pattern: /^(aug|augmented|\+)[\s\-]?7$/i, replacement: '+7' },
  ];

  let matched = false;
  for (const rule of multiTokenRules) {
    if (rule.pattern.test(chordPart)) {
      chordPart = rule.replacement;
      matched = true;
      break;
    }
  }

  // If no multi-token match, apply single-token rules
  if (!matched) {
    const singleTokenRules = [
      // Half-diminished (m7b5, half dim, etc.)
      { pattern: /^(halfdiminished|half\-?dim|ø|m7b5|min7b5|minor7b5|m7flat5|min7flat5|minor7flat5|m7♭5|min7♭5|minor7♭5|half\-?diminished|half\s*dim|half\s*diminished|half\s*dim7|half\-?dim7|half\s*diminished7|half\-?diminished7|flat5|b5)$/i, replacement: 'm7♭5' },
      // Major 7th (maj7, M7, major7, etc.)
      { pattern: /^(major7|maj7|ma7|M7|Δ|∆)$/i, replacement: 'maj7' },
      // Minor 7th (min7, m7, minor7, etc.)
      { pattern: /^(minor7|min7|m7)$/i, replacement: 'm7' },
      // Dominant 7th (dominant7, dom7, dominant, dom)
      { pattern: /^(dominant7|dom7|dominant|dom)$/i, replacement: '7' },
      // Diminished (dim, diminished, o, °)
      { pattern: /^(diminished|dim|o|°|˚)$/i, replacement: '˚' },
      // Minor (min, m, -)
      { pattern: /^(minor|min|m|\-)$/i, replacement: 'm' },
      // Major (major, maj)
      { pattern: /^(major|maj)$/i, replacement: '' },
      // Augmented (aug, +)
      { pattern: /^(augmented|aug|\+)$/i, replacement: '+' },
      // 7th (7)
      { pattern: /^7$/, replacement: '7' },
    ];

    for (const rule of singleTokenRules) {
      if (rule.pattern.test(chordPart)) {
        chordPart = rule.replacement;
        matched = true;
        break;
      }
    }
  }

  // If no match, check for simple cases
  if (!matched) {
    // If the rest is empty, just return the note
    if (!chordPart) return normalizedNote;
    // If the rest is 'm', return minor
    if (chordPart === 'm') return normalizedNote + 'm';
    // If the rest is '7', return dominant 7
    if (chordPart === '7') return normalizedNote + '7';
    // If the rest is '+', return augmented
    if (chordPart === '+') return normalizedNote + '+';
    // If the rest is '˚', return diminished
    if (chordPart === '˚') return normalizedNote + '˚';
    // Otherwise, return normalizedNote + chordPart (as fallback)
    return normalizedNote + chordPart;
  }

  // Return normalized chord
  return normalizedNote + chordPart;
}

function accidentalToUnicode(s) {
  s = s.trim();
  if (/^bb$/i.test(s)) return 'B♭';
    if (/^b$/i.test(s)) return 'B'; // common mistake
  if (/^([A-Ga-g])bb$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2B';
  if (/^([A-Ga-g])(##|x)$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2A';
  if (/^([A-Ga-g])b$/.test(s)) return s[0].toUpperCase() + '♭';
  if (/^([A-Ga-g])#$/.test(s)) return s[0].toUpperCase() + '#';
  return s.toUpperCase().normalize('NFC');
}

function normalizeAccList(strOrArr) {
  const list = Array.isArray(strOrArr) ? strOrArr : String(strOrArr).replace(/,/g, ' ').split(/\s+/);
  return list.map(s => accidentalToUnicode(s)).filter(Boolean).sort().join(' ').trim();
}


// --- 3. State Management & Progression ---

function initLearningState() {
  // For this complex progression, we always start fresh.
  // Can re-introduce localStorage later, but would need a robust way to handle path changes.
}

function getCurrentLevel() {
  return learningPath[learningState.currentLevelIndex];
}

function advanceQuestionPointer() {
    const level = getCurrentLevel();
    
    if (level.mode === MODES.LINEAR) {
        // For linear mode, advance chapter normally
        learningState.currentChapterIndex++;
        
        // If the key is C and we would now ask to NAME the accidentals, skip it.
        const key = level.keys[learningState.currentKeyIndex];
        const nextChapter = level.chapters[learningState.currentChapterIndex];
        if (key === 'C' && nextChapter && nextChapter.id === CHAPTERS.ACCIDENTALS_NAMES.id) {
            learningState.currentChapterIndex++; // Skip ahead
        }
        
        if (learningState.currentChapterIndex >= level.chapters.length) {
            learningState.currentChapterIndex = 0;
            // This should not happen in linear mode as we handle key advancement in handleAnswerSubmit
        }
    } else {
        // For non-linear modes, advance chapter normally
        learningState.usedDegrees = []; // Reset for triad questions in next chapter
        learningState.currentChapterIndex++;
        
        if (learningState.currentChapterIndex >= level.chapters.length) {
            learningState.currentChapterIndex = 0;
            // For random modes, a new key is picked on each question automatically.
        }
    }
}

function advanceLevel() {
    learningState.currentLevelIndex++;
    learningState.currentChapterIndex = 0;
    learningState.currentKeyIndex = 0;
    learningState.correctAnswerStreak = 0;
}


// --- 4. UI Rendering & Event Handling ---

function renderAppLayout() {
  const appContainer = document.getElementById('app-container');
  appContainer.innerHTML = `
    <header class="app-header">
      <img src="/images/lb-loop-logo-white-on-trans.png" alt="Logo" class="app-logo">
    </header>
    <div class="main-content">
      <div class="quiz-section">
        <div class="question-display" id="question-display"></div>
        <div class="answer-container">
          <form id="answer-form">
            <input type="text" id="answer-input" placeholder="Your answer..." autocomplete="off">
            <button type="submit" id="submit-btn" class="btn">Submit</button>
          </form>
          <div class="feedback" id="feedback"></div>
        </div>
      </div>
    </div>
  `;
  
  // Restore the advanced practice section
  const advancedRoot = document.getElementById('advanced-practice-root');
  if (advancedRoot) {
    advancedRoot.innerHTML = `
      <div class="advanced-practice">
        <h3>Advanced Practice</h3>
        <div class="practice-controls">
          <button id="advanced1-btn" class="btn">Randomize</button>
          <button id="advanced2-btn" class="btn">Sevenths</button>
        </div>
      </div>
    `;
  }

  attachEventListeners();
}

function attachEventListeners() {
  const form = document.getElementById('answer-form');
  const submitBtn = document.getElementById('submit-btn');
  
  if (form) {
    form.addEventListener('submit', handleAnswerSubmit);
  } else {
    console.error('Form not found');
  }
  
  if (submitBtn) {
    submitBtn.addEventListener('click', handleAnswerSubmit);
  } else {
    console.error('Submit button not found');
  }
  
  const answerInput = document.getElementById('answer-input');
  if (answerInput) {
    answerInput.addEventListener('click', () => {
      if (learningState.lastAnswerIncorrect) {
        answerInput.value = '';
        learningState.lastAnswerIncorrect = false;
      }
    });
  } else {
    console.error('Answer input not found');
  }
  
  // Restore advanced practice button listeners
  const advanced1Btn = document.getElementById('advanced1-btn');
  const advanced2Btn = document.getElementById('advanced2-btn');
  
  if (advanced1Btn) {
    advanced1Btn.addEventListener('click', () => startAdvancedPractice('random_all'));
  }
  if (advanced2Btn) {
    advanced2Btn.addEventListener('click', () => startAdvancedPractice('sevenths_only'));
  }
}

function updateQuestionUI(text) {
  const questionDisplay = document.getElementById('question-display');
  const answerInput = document.getElementById('answer-input');
  const feedback = document.getElementById('feedback');
  
  if (getCurrentLevel().mode === MODES.COMPLETE) {
      questionDisplay.textContent = 'Congratulations! You have completed all levels.';
      document.getElementById('answer-form').style.display = 'none';
  } else {
      document.getElementById('answer-form').style.display = 'flex';
      questionDisplay.textContent = text;
      answerInput.value = '';
      feedback.textContent = '';
      feedback.className = 'feedback';
      answerInput.focus();
  }
}


// --- 5. Question and Answer Logic ---

function askQuestion() {
  const level = getCurrentLevel();
  if (level.mode === MODES.COMPLETE) {
      updateQuestionUI('');
    return;
  }
  
  let key, chapter;
  
  // Determine the key for the question
  if (level.mode === MODES.LINEAR) {
      key = level.keys[learningState.currentKeyIndex];
  } else { // All other modes use random keys from the level's key list
      key = level.keys[Math.floor(Math.random() * level.keys.length)];
  }
  
  // Determine the chapter for the question
  if (level.mode === MODES.RANDOM_ALL) {
      chapter = level.chapters[Math.floor(Math.random() * level.chapters.length)];
  } else { // Linear and Random_Keys_Linear_Chapters use the linear chapter progression
      chapter = level.chapters[learningState.currentChapterIndex];
  }

  learningState.currentQuestion = { key, chapterId: chapter.id };
  let text = '';
  let degree;

  switch (chapter.id) {
    case QUESTION_TYPES.ACCIDENTALS_COUNT:
      text = `How many accidentals are in ${key} major?`;
      break;
    case QUESTION_TYPES.ACCIDENTALS_NAMES:
      text = `Name the accidentals in ${key} major.`;
      break;
    case QUESTION_TYPES.SCALE_SPELLING:
      text = `Spell the ${key} major scale.`;
      break;
    case QUESTION_TYPES.TRIADS:
    case QUESTION_TYPES.SEVENTHS:
    case QUESTION_TYPES.SEVENTH_SPELLING:
      const allDegrees = [2, 3, 4, 5, 6, 7];
      let availableDegrees = allDegrees.filter(d => !learningState.usedDegrees.includes(d));
      
      if (availableDegrees.length === 0) {
        // All degrees have been used for this key
        // For linear mode, this should not happen as we handle progression in handleAnswerSubmit
        // For non-linear modes, reset and continue
        const level = getCurrentLevel();
        if (level.mode !== MODES.LINEAR) {
          learningState.usedDegrees = [];
          availableDegrees = allDegrees;
        }
      }
      
      degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
      learningState.currentQuestion.degree = degree;
      
      const chordType = chapter.id === QUESTION_TYPES.TRIADS ? 'triad' : 'seventh chord';
      const action = chapter.id === QUESTION_TYPES.SEVENTH_SPELLING ? 'Spell' : 'Name';
      text = `${action} the ${ordinal(degree)} ${chordType} in ${key} major.`;
      break;
  }
  
  updateQuestionUI(text);
  learningState.lastAnswerIncorrect = false;
}

function handleAnswerSubmit(e) {
  e.preventDefault();
  const answer = document.getElementById('answer-input').value;
  const feedback = document.getElementById('feedback');
  const isCorrect = checkAnswer(answer);

  if (isCorrect) {
    // Clear any previous "Incorrect" messages
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    if (learningState.isAdvancedMode) {
      // Handle A/B pair logic for accidentals questions
      if (learningState.currentQuestion && 
          learningState.currentQuestion.chapterId === QUESTION_TYPES.ACCIDENTALS_COUNT &&
          quizData[learningState.currentQuestion.key].accidentals > 0) {
        // We just answered accidentals count correctly, now ask naming for the same key
        const key = learningState.currentQuestion.key;
        learningState.currentQuestion = { key: key, chapterId: QUESTION_TYPES.ACCIDENTALS_NAMES };
        const text = `Name the accidentals in ${key} major.`;
        updateQuestionUI(text);
      } else {
        // Normal case - start a new random question
        startAdvancedPractice(learningState.advancedModeType);
      }
    } else {
      const level = getCurrentLevel();
      
      if (level.mode === MODES.LINEAR) {
        // For linear mode, handle progression based on question type
        const currentChapter = level.chapters[learningState.currentChapterIndex];
        
        if (currentChapter.id === QUESTION_TYPES.TRIADS) {
          // This is a chord question - increment counter
          learningState.correctChordAnswersForCurrentKey++;
          
          // Add the degree to usedDegrees to prevent asking the same chord again
          if (learningState.currentQuestion && learningState.currentQuestion.degree) {
            learningState.usedDegrees.push(learningState.currentQuestion.degree);
          }
          
          // Check if we've answered 3 chord questions correctly
          if (learningState.correctChordAnswersForCurrentKey >= 3) {
            // Reset counter and advance to next key
            learningState.correctChordAnswersForCurrentKey = 0;
            learningState.usedDegrees = [];
            learningState.currentKeyIndex++;
            
            // Check if we've completed all keys in this level
            if (learningState.currentKeyIndex >= level.keys.length) {
              advanceLevel();
  } else {
              // Reset to first chapter for the new key
              learningState.currentChapterIndex = 0;
            }
          } else {
            // Stay in triads chapter for more chord questions
            // Don't advance chapter index
          }
        } else {
          // Not a chord question - advance normally
          advanceQuestionPointer();
        }
      } else {
        // For non-linear modes, use the streak-based progression
        learningState.correctAnswerStreak++;

        // Check if the streak completes the LEVEL
        if (learningState.correctAnswerStreak >= level.requiredStreak) {
          advanceLevel();
        } else {
          advanceQuestionPointer();
        }
      }
      askQuestion();
    }
  } else {
    feedback.textContent = 'Incorrect. Try again.';
    feedback.className = 'feedback incorrect';
    learningState.correctAnswerStreak = 0; // Reset streak on incorrect answer
    learningState.lastAnswerIncorrect = true;
  }
}

function checkAnswer(answer) {
  const q = learningState.currentQuestion;
  if (!q) return false;

  const { key, chapterId, degree } = q;
  const data = quizData[key];

  switch(chapterId) {
    case QUESTION_TYPES.ACCIDENTALS_COUNT:
      const normalizedAnswer = answer.trim().toLowerCase();
      if (data.accidentals === 0) {
        return ['0', 'zero', 'none'].includes(normalizedAnswer);
      }
      const digitAnswer = parseInt(normalizedAnswer, 10);
      if (digitAnswer === data.accidentals) return true;
      const wordAnswer = wordToNumber(normalizedAnswer);
      return wordAnswer === data.accidentals;

    case QUESTION_TYPES.ACCIDENTALS_NAMES:
      if (data.accidentals === 0) return answer.trim() === '';
      return normalizeAccList(answer) === normalizeAccList(data.notes);

    case QUESTION_TYPES.SCALE_SPELLING:
      const correctScale = data.scale.map(n => n.toUpperCase()).join('');
      const userScale = answer.trim().split(/\s+/).map(accidentalToUnicode).join('').toUpperCase();
      return userScale === correctScale;

    case QUESTION_TYPES.TRIADS:
      return normalizeChord(answer).toUpperCase() === normalizeChord(data.triads[degree]).toUpperCase();

    case QUESTION_TYPES.SEVENTHS:
      return normalizeChord(answer).toUpperCase() === normalizeChord(data.sevenths[degree]).toUpperCase();

    case QUESTION_TYPES.SEVENTH_SPELLING:
      const correctSpelling = data.seventhSpelling[degree].map(n => n.toUpperCase()).join('');
      const userSpelling = answer.trim().split(/\s+/).map(accidentalToUnicode).join('').toUpperCase();
      return userSpelling === correctSpelling;
  }
  return false;
}


// --- 6. Learning Path Progression ---

function startAdvancedPractice(mode) {
  // Set advanced mode flags
  learningState.isAdvancedMode = true;
  learningState.advancedModeType = mode;
  learningState.correctAnswerStreak = 0;
  learningState.usedDegrees = [];
  learningState.currentQuestion = null;
  
  if (mode === 'random_all') {
    // For random practice, we'll use a simple approach
    // Pick a random key and random chapter
    let randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    let randomChapter;
    
    // Pick a random chapter, but exclude accidentals naming and seventh spelling
    const availableChapters = ALL_CHAPTERS.filter(chapter => 
      chapter.id !== QUESTION_TYPES.ACCIDENTALS_NAMES &&
      chapter.id !== QUESTION_TYPES.SEVENTH_SPELLING
    );
    randomChapter = availableChapters[Math.floor(Math.random() * availableChapters.length)];
    
    learningState.currentQuestion = { key: randomKey, chapterId: randomChapter.id };
    
    let text = '';
    let degree;

    switch (randomChapter.id) {
      case QUESTION_TYPES.ACCIDENTALS_COUNT:
        text = `How many accidentals are in ${randomKey} major?`;
        break;
      case QUESTION_TYPES.SCALE_SPELLING:
        text = `Spell the ${randomKey} major scale.`;
        break;
      case QUESTION_TYPES.TRIADS:
      case QUESTION_TYPES.SEVENTHS:
        degree = [2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 6)];
        learningState.currentQuestion.degree = degree;
        
        const chordType = randomChapter.id === QUESTION_TYPES.TRIADS ? 'triad' : 'seventh chord';
        const action = 'Name';
        text = `${action} the ${ordinal(degree)} ${chordType} in ${randomKey} major.`;
        break;
    }
    
    updateQuestionUI(text);
    
  } else if (mode === 'sevenths_only') {
    // For sevenths practice, focus ONLY on seventh chord spelling
    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    const randomChapter = CHAPTERS.SEVENTH_SPELLING; // Only spelling, not naming
    
    learningState.currentQuestion = { key: randomKey, chapterId: randomChapter.id };
    
    const degree = [2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 6)];
    learningState.currentQuestion.degree = degree;
    
    const chordType = 'seventh chord';
    const action = 'Spell';
    const text = `${action} the ${ordinal(degree)} ${chordType} in ${randomKey} major.`;
    
    updateQuestionUI(text);
  }
}


// --- 7. Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  initLearningState();
  renderAppLayout();
    askQuestion();
}); 