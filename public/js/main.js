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
  RANDOM: 'random',
  ADVANCED_ALL: 'advanced',
  ADVANCED_SEVENTHS: 'advanced2'
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

const orderedKeys = ['F♯', 'B', 'E', 'A', 'D', 'G', 'C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'];
const allKeys = Object.keys(quizData);

const learningPath = {
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

const learningState = {
  currentGroup: 0,
  currentKeyIndex: 0,
  currentChapterIndex: 0,
  mode: MODES.LINEAR,
  currentQuestion: null,
  correctAnswersInChapter: 0,
  requiredAnswersPerChapter: 3,
  usedDegrees: [],
  lastAnswerIncorrect: false
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
  let normalized = raw.trim().toUpperCase();
  
  // Handle minor chord variations
  normalized = normalized.replace(/\s+/g, ""); // Remove spaces
  normalized = normalized.replace(/MINOR/g, "M");
  normalized = normalized.replace(/MIN/g, "M");
  normalized = normalized.replace(/-/g, "M"); // D- becomes DM
  
  // Handle major chord variations (though we don't use them in our data)
  normalized = normalized.replace(/MAJOR/g, "");
  normalized = normalized.replace(/MAJ/g, "");
  
  // Handle diminished chord variations - including the "˚" symbol
  normalized = normalized.replace(/DIMINISHED/g, "˚");
  normalized = normalized.replace(/DIMIN/g, "˚");
  normalized = normalized.replace(/DIM/g, "˚");
  
  // Handle dominant 7th variations
  normalized = normalized.replace(/DOMINANT/g, "");
  normalized = normalized.replace(/DOM/g, "");
  
  // Handle major 7th variations
  normalized = normalized.replace(/MAJ7/g, "MAJ7");
  normalized = normalized.replace(/MAJOR7/g, "MAJ7");
  
  // Handle minor 7th flat 5 variations
  normalized = normalized.replace(/M7B5/g, "M7♭5");
  normalized = normalized.replace(/M7FLAT5/g, "M7♭5");
  normalized = normalized.replace(/HALFDIMINISHED/g, "M7♭5");
  normalized = normalized.replace(/HALFDIM/g, "M7♭5");
  
  // Allow "˚" as a direct input for diminished
  // The quizData uses "˚" so this makes matching easier
  
  return normalized;
}

function accidentalToUnicode(s) {
  s = s.trim();
  if (/^bb$/i.test(s)) return 'B♭';
    if (/^b$/i.test(s)) return 'B'; // common mistake
  if (/^([A-Ga-g])bb$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2B';
  if (/^([A-Ga-g])(##|x)$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2A';
  if (/^([A-Ga-g])b$/.test(s)) return s[0].toUpperCase() + '♭';
  if (/^([A-Ga-g])#$/.test(s)) return s[0].toUpperCase() + '♯';
  return s.toUpperCase().normalize('NFC');
}

function normalizeAccList(strOrArr) {
  const list = Array.isArray(strOrArr) ? strOrArr : String(strOrArr).replace(/,/g, ' ').split(/\s+/);
  return list.map(s => accidentalToUnicode(s)).filter(Boolean).sort().join(' ').trim();
}


// --- 3. State Management ---

function initLearningState() {
  const saved = localStorage.getItem('learningState');
  if (saved) {
    Object.assign(learningState, JSON.parse(saved));
  }

  // Development mode - set to true to always start fresh for testing
  if (false) {
    console.log("DEV MODE: Resetting learning state.");
    Object.assign(learningState, {
      currentGroup: 0,
      currentKeyIndex: 0,
      currentChapterIndex: 0,
      correctAnswersInChapter: 0,
      usedDegrees: [],
      mode: MODES.LINEAR,
    });
  }
  
  // Reset transient states that shouldn't persist across sessions
  learningState.lastAnswerIncorrect = false;
  if (!Array.isArray(learningState.usedDegrees)) {
    learningState.usedDegrees = [];
  }
}

function saveLearningState() {
  localStorage.setItem('learningState', JSON.stringify(learningState));
}

function getCurrentGroup() {
  return learningPath.groups[learningState.currentGroup];
}

function getCurrentKey() {
  const group = getCurrentGroup();
  if (learningState.mode === MODES.RANDOM || learningState.mode.startsWith('advanced')) {
    return group.keys[Math.floor(Math.random() * group.keys.length)];
  }
  return group.keys[learningState.currentKeyIndex];
}

function getCurrentChapter() {
   const { mode, currentChapterIndex } = learningState;
   if (mode === MODES.ADVANCED_ALL) {
     const availableChapters = learningPath.chapters.filter(c => c.id !== QUESTION_TYPES.SEVENTH_SPELLING);
     return availableChapters[Math.floor(Math.random() * availableChapters.length)];
   }
   if (mode === MODES.ADVANCED_SEVENTHS) {
     return learningPath.chapters.find(c => c.id === QUESTION_TYPES.SEVENTH_SPELLING);
   }
  return learningPath.chapters[currentChapterIndex];
}


// --- 4. UI Rendering & Event Handling ---

function renderAppLayout() {
  const appContainer = document.getElementById('app-container');
  const advancedRoot = document.getElementById('advanced-practice-root');
  if (!appContainer || !advancedRoot) return;

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
  
  advancedRoot.innerHTML = `
    <div class="advanced-practice">
      <h3>Advanced Practice</h3>
      <div class="practice-controls">
        <button id="advanced1-btn" class="btn">Randomize</button>
        <button id="advanced2-btn" class="btn">Sevenths</button>
      </div>
    </div>
  `;

  attachEventListeners();
}

function attachEventListeners() {
  document.getElementById('answer-form').addEventListener('submit', handleAnswerSubmit);
  
  const answerInput = document.getElementById('answer-input');
  answerInput.addEventListener('click', () => {
    if (learningState.lastAnswerIncorrect) {
      answerInput.value = '';
      learningState.lastAnswerIncorrect = false;
    }
  });
  
  document.getElementById('advanced1-btn').addEventListener('click', () => startAdvancedPractice(MODES.ADVANCED_ALL));
  document.getElementById('advanced2-btn').addEventListener('click', () => startAdvancedPractice(MODES.ADVANCED_SEVENTHS));
}

function updateQuestionUI(text) {
  const questionDisplay = document.getElementById('question-display');
  const answerInput = document.getElementById('answer-input');
  const feedback = document.getElementById('feedback');
  
  document.getElementById('answer-form').style.display = 'flex';
  questionDisplay.textContent = text;
  answerInput.value = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  answerInput.focus();
}


// --- 5. Question and Answer Logic ---

function askQuestion() {
  const key = getCurrentKey();
  const chapter = getCurrentChapter();
  let text = '';
  let degree;

  learningState.currentQuestion = { key, chapterId: chapter.id };

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
        learningState.usedDegrees = [];
        availableDegrees = allDegrees;
      }
      
      degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
      learningState.usedDegrees.push(degree);
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
    feedback.textContent = 'Correct!';
    feedback.className = 'feedback correct';
    handleCorrectAnswer();
  } else {
    feedback.textContent = 'Incorrect. Try again.';
    feedback.className = 'feedback incorrect';
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
      return normalizeChord(answer) === normalizeChord(data.triads[degree]);

    case QUESTION_TYPES.SEVENTHS:
      return normalizeChord(answer) === normalizeChord(data.sevenths[degree]);

    case QUESTION_TYPES.SEVENTH_SPELLING:
      const correctSpelling = data.seventhSpelling[degree].map(n => n.toUpperCase()).join('');
      const userSpelling = answer.trim().split(/\s+/).map(accidentalToUnicode).join('').toUpperCase();
      return userSpelling === correctSpelling;
  }
  return false;
}

function handleCorrectAnswer() {
  if (learningState.mode.startsWith('advanced')) {
    askQuestion();
  } else {
    const currentChapter = getCurrentChapter();
    const isMultiQuestionChapter = [QUESTION_TYPES.TRIADS, QUESTION_TYPES.SEVENTHS].includes(currentChapter.id);

    if (isMultiQuestionChapter) {
      learningState.correctAnswersInChapter++;
      if (learningState.correctAnswersInChapter >= learningState.requiredAnswersPerChapter) {
        advanceLearningPath();
      } else {
        askQuestion();
      }
    } else {
      advanceLearningPath();
    }
  }
  saveLearningState();
}


// --- 6. Learning Path Progression ---

function advanceLearningPath() {
  const group = getCurrentGroup();
  const key = getCurrentKey();
  const chapter = getCurrentChapter();
  
  learningState.correctAnswersInChapter = 0;
  learningState.usedDegrees = [];
  
  if (chapter.id === QUESTION_TYPES.ACCIDENTALS_COUNT && quizData[key].accidentals === 0) {
    learningState.currentChapterIndex += 2; // Skip accNotes
  } else {
    learningState.currentChapterIndex++;
  }
  
  // Have all chapters in the current key been completed?
  if (learningState.currentChapterIndex >= learningPath.chapters.length) {
    learningState.currentChapterIndex = 0;
    learningState.currentKeyIndex++;
    
    // Have all keys in the current group been completed?
    if (learningState.currentKeyIndex >= group.keys.length) {
      learningState.currentKeyIndex = 0;
      learningState.currentGroup++;
      
      // Have all groups been completed?
      if (learningState.currentGroup >= learningPath.groups.length) {
        // Path complete! Move to advanced practice.
        startAdvancedPractice(MODES.ADVANCED_ALL);
        return; // Exit to avoid asking another question here
      } else {
        // Start the new group
        learningState.mode = getCurrentGroup().mode;
      }
    }
  }
  
  askQuestion();
}

function startAdvancedPractice(mode) {
    learningState.mode = mode;
    const groupName = mode === MODES.ADVANCED_ALL ? 'Randomize' : 'Seventh Spelling';
    learningState.currentGroup = learningPath.groups.findIndex(g => g.name === groupName);
    learningState.currentChapterIndex = 0;
    learningState.correctAnswersInChapter = 0;
    askQuestion();
}


// --- 7. Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  initLearningState();
  renderAppLayout();
  askQuestion();
}); 