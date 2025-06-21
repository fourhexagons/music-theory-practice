console.log('main.js loaded');

// --- 1. Constants and Data ---
const quizData = {
  C: {
    accidentals:0, notes:[],
    scale:["C","D","E","F","G","A","B"],
    triads:{2:"Dm",3:"Em",4:"F",5:"G",6:"Am",7:"Bdim"},
    sevenths:{2:"Dm7",3:"Em7",4:"Fmaj7",5:"G7",6:"Am7",7:"Bm7♭5"},
    seventhSpelling:{2:["D","F","A","C"],3:["E","G","B","D"],4:["F","A","C","E"],5:["G","B","D","F"],6:["A","C","E","G"],7:["B","D","F","A"]}
  },
  G: {
    accidentals:1, notes:["F#"],
    scale:["G","A","B","C","D","E","F#"],
    triads:{2:"Am",3:"Bm",4:"C",5:"D",6:"Em",7:"F#dim"},
    sevenths:{2:"Am7",3:"Bm7",4:"Cmaj7",5:"D7",6:"Em7",7:"F#m7♭5"},
    seventhSpelling:{2:["A","C","E","G"],3:["B","D","F#","A"],4:["C","E","G","B"],5:["D","F#","A","C"],6:["E","G","B","D"],7:["F#","A","C","E"]}
  },
  D: {
    accidentals:2, notes:["F#","C#"],
    scale:["D","E","F#","G","A","B","C#"],
    triads:{2:"Em",3:"F#m",4:"G",5:"A",6:"Bm",7:"C#dim"},
    sevenths:{2:"Em7",3:"F#m7",4:"Gmaj7",5:"A7",6:"Bm7",7:"C#m7♭5"},
    seventhSpelling:{2:["E","G","B","D"],3:["F#","A","C#","E"],4:["G","B","D","F#"],5:["A","C#","E","G"],6:["B","D","F#","A"],7:["C#","E","G","B"]}
  },
  A: {
    accidentals:3, notes:["F#","C#","G#"],
    scale:["A","B","C#","D","E","F#","G#"],
    triads:{2:"Bm",3:"C#m",4:"D",5:"E",6:"F#m",7:"G#dim"},
    sevenths:{2:"Bm7",3:"C#m7",4:"Dmaj7",5:"E7",6:"F#m7",7:"G#m7♭5"},
    seventhSpelling:{2:["B","D","F#","A"],3:["C#","E","G#","B"],4:["D","F#","A","C#"],5:["E","G#","B","D"],6:["F#","A","C#","E"],7:["G#","B","D","F#"]}
  },
  E: {
    accidentals:4, notes:["F#","C#","G#","D#"],
    scale:["E","F#","G#","A","B","C#","D#"],
    triads:{2:"F#m",3:"G#m",4:"A",5:"B",6:"C#m",7:"D#dim"},
    sevenths:{2:"F#m7",3:"G#m7",4:"Amaj7",5:"B7",6:"C#m7",7:"D#m7♭5"},
    seventhSpelling:{2:["F#","A","C#","E"],3:["G#","B","D#","F#"],4:["A","C#","E","G#"],5:["B","D#","F#","A"],6:["C#","E","G#","B"],7:["D#","F#","A#","C#"]}
  },
  B: {
    accidentals:5, notes:["F#","C#","G#","D#","A#"],
    scale:["B","C#","D#","E","F#","G#","A#"],
    triads:{2:"C#m",3:"D#m",4:"E",5:"F#",6:"G#m",7:"A#dim"},
    sevenths:{2:"C#m7",3:"D#m7",4:"Emaj7",5:"F#7",6:"G#m7",7:"A#m7♭5"},
    seventhSpelling:{2:["C#","E","G#","B"],3:["D#","F#","A#","C#"],4:["E","G#","B","D#"],5:["F#","A#","C#","E"],6:["G#","B","D#","F#"],7:["A#","C#","E","G#"]}
  },
  "B♭": {
    accidentals:2, notes:["B♭","E♭"],
    scale:["B♭","C","D","E♭","F","G","A"],
    triads:{2:"Cm",3:"Dm",4:"E♭",5:"F",6:"Gm",7:"Adim"},
    sevenths:{2:"Cm7",3:"Dm7",4:"E♭maj7",5:"F7",6:"Gm7",7:"Am7♭5"},
    seventhSpelling:{2:["C","E♭","G","B♭"],3:["D","F","A","C"],4:["E♭","G","B♭","D"],5:["F","A","C","E♭"],6:["G","B♭","D","F"],7:["A","C","E♭","G"]}
  },
  "E♭": {
    accidentals:3, notes:["B♭","E♭","A♭"],
    scale:["E♭","F","G","A♭","B♭","C","D"],
    triads:{2:"Fm",3:"Gm",4:"A♭",5:"B♭",6:"Cm",7:"Ddim"},
    sevenths:{2:"Fm7",3:"Gm7",4:"A♭maj7",5:"B♭7",6:"Cm7",7:"Dm7♭5"},
    seventhSpelling:{2:["F","A♭","C","E♭"],3:["G","B♭","D","F"],4:["A♭","C","E♭","G"],5:["B♭","D","F","A♭"],6:["C","E♭","G","B♭"],7:["D","F","A♭","C"]}
  },
  F: {
    accidentals:1, notes:["B♭"],
    scale:["F","G","A","B♭","C","D","E"],
    triads:{2:"Gm",3:"Am",4:"B♭",5:"C",6:"Dm",7:"Edim"},
    sevenths:{2:"Gm7",3:"Am7",4:"B♭maj7",5:"C7",6:"Dm7",7:"Em7♭5"},
    seventhSpelling:{2:["G","B♭","D","F"],3:["A","C","E","G"],4:["B♭","D","F","A"],5:["C","E","G","B♭"],6:["D","F","A","C"],7:["E","G","B♭","D"]}
  },
  "A♭": {
    accidentals:4, notes:["B♭","E♭","A♭","D♭"],
    scale:["A♭","B♭","C","D♭","E♭","F","G"],
    triads:{2:"B♭m",3:"Cm",4:"D♭",5:"E♭",6:"Fm",7:"Gdim"},
    sevenths:{2:"B♭m7",3:"Cm7",4:"D♭maj7",5:"E♭7",6:"Fm7",7:"Gm7♭5"},
    seventhSpelling:{2:["B♭","D♭","F","A♭"],3:["C","E♭","G","B♭"],4:["D♭","F","A♭","C"],5:["E♭","G","B♭","D♭"],6:["F","A♭","C","E♭"],7:["G","B♭","D♭","F"]}
  },
  "D♭": {
    accidentals:5, notes:["B♭","E♭","A♭","D♭","G♭"],
    scale:["D♭","E♭","F","G♭","A♭","B♭","C"],
    triads:{2:"E♭m",3:"Fm",4:"G♭",5:"A♭",6:"B♭m",7:"Cdim"},
    sevenths:{2:"E♭m7",3:"Fm7",4:"G♭maj7",5:"A♭7",6:"B♭m7",7:"Cm7♭5"},
    seventhSpelling:{2:["E♭","G♭","B♭","D♭"],3:["F","A♭","C","E♭"],4:["G♭","B♭","D♭","F"],5:["A♭","C","E♭","G♭"],6:["B♭","D♭","F","A♭"],7:["C","E♭","G♭","B♭"]}
  },
  "F♯": {
    accidentals:6, notes:["F#","C#","G#","D#","A#","E#"],
    scale:["F#","G#","A#","B","C#","D#","E#"],
    triads:{2:"G#m",3:"A#m",4:"B",5:"C#",6:"D#m",7:"E#dim"},
    sevenths:{2:"G#m7",3:"A#m7",4:"Bmaj7",5:"C#7",6:"D#m7",7:"E#m7♭5"},
    seventhSpelling:{2:["G#","B","D#","F#"],3:["A#","C#","E#","G#"],4:["B","D#","F#","A#"],5:["C#","E#","G#","B"],6:["D#","F#","A#","C#"],7:["E#","G#","B","D#"]}
  },
  "G♭": {
    accidentals:6, notes:["B♭","E♭","A♭","D♭","G♭","C♭"],
    scale:["G♭","A♭","B♭","C♭","D♭","E♭","F"],
    triads:{2:"A♭m",3:"B♭m",4:"C♭",5:"D♭",6:"E♭m",7:"Fdim"},
    sevenths:{2:"A♭m7",3:"B♭m7",4:"C♭maj7",5:"D♭7",6:"E♭m7",7:"Fm7♭5"},
    seventhSpelling:{2:["A♭","C♭","E♭","G♭"],3:["B♭","D♭","F","A♭"],4:["C♭","E♭","G♭","B♭"],5:["D♭","F","A♭","C♭"],6:["E♭","G♭","B♭","D♭"],7:["F","A♭","C♭","E♭"]}
  }
};

// Custom ordered keys array with C in the center
const orderedKeys = ['F♯', 'B', 'E', 'A', 'D', 'G', 'C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'];

const allKeys = Object.keys(quizData);

// --- Utility Functions ---
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

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

function normalize(raw) {
  if (!raw) return "";
  return raw.trim().replace(/b/g, "♭").toUpperCase().replace(/\s+/g, " ");
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
  
  // Handle diminished chord variations
  normalized = normalized.replace(/DIMINISHED/g, "DIM");
  normalized = normalized.replace(/DIMIN/g, "DIM");
  
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

// --- Learning Path Engine ---
const learningPath = {
  groups: [
    { name: 'Introduction', keys: ['C'], mode: 'linear' },
    { name: 'Sharps 1', keys: ['G', 'D', 'A'], mode: 'linear' },
    { name: 'Sharps 1 Review', keys: ['G', 'D', 'A'], mode: 'random' },
    { name: 'Flats 1', keys: ['F', 'B♭', 'E♭'], mode: 'linear' },
    { name: 'Flats 1 Review', keys: ['F', 'B♭', 'E♭'], mode: 'random' },
    { name: 'Sharps 2', keys: ['E', 'B', 'F♯'], mode: 'linear' },
    { name: 'Sharps 2 Review', keys: ['E', 'B', 'F♯'], mode: 'random' },
    { name: 'Flats 2', keys: ['A♭', 'D♭', 'G♭'], mode: 'linear' },
    { name: 'Flats 2 Review', keys: ['A♭', 'D♭', 'G♭'], mode: 'random' },
    { name: 'All Sharps', keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F♯'], mode: 'random' },
    { name: 'All Flats', keys: ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'], mode: 'random' },
    { name: 'Advanced 1 (All Topics)', keys: allKeys, mode: 'advanced' },
    { name: 'Advanced 2 (Chord Spelling)', keys: allKeys, mode: 'advanced2' }
  ],
  chapters: [
    { id: 'accCount', name: 'Accidentals Count' },
    { id: 'accNotes', name: 'Accidentals Naming' },
    { id: 'scale', name: 'Scale Spelling' },
    { id: 'triads', name: 'Triads' }
  ]
};

const learningState = {
  currentGroup: 0,
  currentKeyIndex: 0,
  currentChapterIndex: 0,
  mode: 'linear',
  currentQuestion: null,
  correctAnswersInChapter: 0,
  requiredAnswersPerChapter: 3,
  usedDegrees: [],
  freePractice: null
};

function initLearningState() {
  const saved = localStorage.getItem('learningState');
  if (saved) {
    Object.assign(learningState, JSON.parse(saved));
  }
  
  // Development mode - uncomment the line below to always start fresh for testing
  if (true) { // Development mode - always start fresh
    learningState.currentGroup = 0;
    learningState.currentKeyIndex = 0;
    learningState.currentChapterIndex = 0;
    learningState.correctAnswersInChapter = 0;
    learningState.mode = 'linear';
    learningState.freePractice = null;
  }
  
  // Reset transient states
  learningState.mode = learningState.mode === 'free-practice' ? 'linear' : learningState.mode;
  learningState.freePractice = null;
  
  // Ensure we start with the correct first question
  if (learningState.mode === 'linear' && learningState.currentChapterIndex !== 0) {
    learningState.currentChapterIndex = 0; // Start with 'accCount'
  }
}

function saveLearningState() {
  localStorage.setItem('learningState', JSON.stringify(learningState));
}

function getCurrentGroup() {
  return learningPath.groups[learningState.currentGroup];
}

function getCurrentKey() {
  if (learningState.mode === 'free-practice') return learningState.freePractice.key;
  const group = getCurrentGroup();
  if (learningState.mode === 'random' || learningState.mode.startsWith('advanced')) {
    return group.keys[Math.floor(Math.random() * group.keys.length)];
  }
  return group.keys[learningState.currentKeyIndex];
}

function getCurrentChapter() {
  if (learningState.mode === 'free-practice') {
    return learningPath.chapters.find(c => c.id === learningState.freePractice.chapterId);
  }
   if (learningState.mode === 'advanced') {
     const chapIdx = Math.floor(Math.random() * learningPath.chapters.length);
     return learningPath.chapters[chapIdx];
   }
   if (learningState.mode === 'advanced2') {
     return learningPath.chapters.find(c => c.id === 'sevenths'); // Or specific advanced chapter
   }
  return learningPath.chapters[learningState.currentChapterIndex];
}

// --- UI Rendering ---
function renderNewUI() {
  const appContainer = document.getElementById('app-container');
  const advancedRoot = document.getElementById('advanced-practice-root');
  if (!appContainer || !advancedRoot) return;

  appContainer.innerHTML = `
    <header class="app-header">
      <h1 class="main-title">Music Theory Practice</h1>
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
    <div class="advanced-practice-container">
      <div class="advanced-practice">
        <h3>Advanced Practice</h3>
        <div class="practice-controls">
          <button id="advanced1-btn" class="btn">All Keys</button>
          <button id="advanced2-btn" class="btn">Sevenths</button>
        </div>
      </div>
    </div>
  `;

  attachNewEventListeners();
  askNewQuestion();
}

function attachNewEventListeners() {
  document.getElementById('answer-form').addEventListener('submit', handleNewAnswer);
  
  const advanced1Btn = document.getElementById('advanced1-btn');
  if (advanced1Btn) {
    advanced1Btn.addEventListener('click', () => startAdvancedPractice('advanced'));
  }

  const advanced2Btn = document.getElementById('advanced2-btn');
  if (advanced2Btn) {
    advanced2Btn.addEventListener('click', () => startAdvancedPractice('advanced2'));
  }
}

// --- Question and Answer Logic ---
function askNewQuestion() {
  // Use advanced question function for advanced modes
  if (learningState.mode === 'advanced' || learningState.mode === 'advanced2') {
    askAdvancedQuestion();
    return;
  }

  const questionDisplay = document.getElementById('question-display');
  const answerInput = document.getElementById('answer-input');
  const feedback = document.getElementById('feedback');
  
  document.getElementById('answer-form').style.display = 'flex';
  answerInput.value = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  answerInput.focus();

  const key = getCurrentKey();
  const chapter = getCurrentChapter();
  let text = '';
  
  learningState.currentQuestion = { key, chapterId: chapter.id };

  switch (chapter.id) {
    case 'accCount':
      text = `How many accidentals are in ${key} major?`;
      break;
    case 'accNotes':
      text = `Name the accidentals in ${key} major.`;
      break;
    case 'scale':
      text = `Spell the ${key} major scale.`;
      break;
    case 'triads':
      // Get available degrees (2-7) that haven't been used yet
      const allDegrees = [2, 3, 4, 5, 6, 7];
      const availableDegrees = allDegrees.filter(d => !learningState.usedDegrees.includes(d));
      
      // If all degrees have been used, reset the used degrees array
      if (availableDegrees.length === 0) {
        learningState.usedDegrees = [];
        availableDegrees.push(...allDegrees);
      }
      
      // Pick a random degree from available ones
      const degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
      learningState.usedDegrees.push(degree);
      learningState.currentQuestion.degree = degree;
      text = `Name the ${ordinal(degree)} triad in ${key} major.`;
      break;
    case 'sevenths':
      const degree7 = Math.floor(Math.random() * 6) + 2;
      learningState.currentQuestion.degree = degree7;
      text = `Name the ${ordinal(degree7)} seventh chord in ${key} major.`;
      break;
    case 'seventhSpelling':
      const degreeSpell = Math.floor(Math.random() * 6) + 2;
      learningState.currentQuestion.degree = degreeSpell;
      text = `Spell the ${ordinal(degreeSpell)} seventh chord in ${key} major.`;
      break;
  }
  questionDisplay.textContent = text;
}

function handleNewAnswer(e) {
  e.preventDefault();
  const answer = document.getElementById('answer-input').value;
  const feedback = document.getElementById('feedback');
  const isCorrect = checkNewAnswer(answer);

  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.className = 'feedback correct';
    handleCorrectAnswer();
  } else {
    feedback.textContent = 'Incorrect. Try again.';
    feedback.className = 'feedback incorrect';
  }
}

function checkNewAnswer(answer) {
  const q = learningState.currentQuestion;
  if (!q) return false;

  const key = q.key;
  const chapterId = q.chapterId;
  const data = quizData[key];

  switch(chapterId) {
    case 'accCount':
      const normalizedAnswer = answer.trim().toLowerCase();
      if (data.accidentals === 0) {
        return ['0', 'zero', 'none'].includes(normalizedAnswer);
      }
      // Try to parse as digit first
      const digitAnswer = parseInt(normalizedAnswer, 10);
      if (digitAnswer === data.accidentals) {
        return true;
      }
      // Try to parse as word
      const wordAnswer = wordToNumber(normalizedAnswer);
      return wordAnswer === data.accidentals;
    case 'accNotes':
      if (data.accidentals === 0) return answer.trim() === '';
      return normalizeAccList(answer) === normalizeAccList(data.notes);
    case 'scale':
      const correctScale = data.scale.map(n => n.toUpperCase()).join('');
      const userScale = answer.trim().split(/\s+/).map(accidentalToUnicode).join('').toUpperCase();
      return userScale === correctScale;
    case 'triads':
      return normalizeChord(answer) === normalizeChord(data.triads[q.degree]);
    case 'sevenths':
      return normalizeChord(answer) === normalizeChord(data.sevenths[q.degree]);
    case 'seventhSpelling':
      const correctSpelling = data.seventhSpelling[q.degree].map(n => n.toUpperCase()).join('');
      const userSpelling = answer.trim().split(/\s+/).map(accidentalToUnicode).join('').toUpperCase();
      return userSpelling === correctSpelling;
  }
  return false;
}

function handleCorrectAnswer() {
  const feedback = document.getElementById('feedback');
  feedback.textContent = 'Correct!';
  feedback.className = 'feedback correct';

  if (learningState.mode === 'free-practice') {
    // Free practice mode - handle accidentals sequence
    const currentQuestion = learningState.currentQuestion;
    if (currentQuestion && currentQuestion.chapterId === 'accCount' && quizData[currentQuestion.key].accidentals === 0) {
      // For keys with 0 accidentals, skip the "Name the accidentals" question
      // and ask a new random question
      askNewQuestion();
    } else if (currentQuestion && currentQuestion.chapterId === 'accCount') {
      // For keys with accidentals, follow up with "Name the accidentals" question
      learningState.freePractice.chapterId = 'accNotes';
      askNewQuestion();
    } else {
      // For other questions, ask a new random question
      askNewQuestion();
    }
  } else if (learningState.mode === 'advanced' || learningState.mode === 'advanced2') {
    // Advanced practice mode - just ask new random questions
    askNewQuestion();
  } else {
    // Linear learning path mode
    const currentChapter = getCurrentChapter();
    
    // Only triad questions require multiple correct answers
    if (currentChapter.id === 'triads') {
      learningState.correctAnswersInChapter++;
      
      if (learningState.correctAnswersInChapter >= learningState.requiredAnswersPerChapter) {
        // Triad chapter completed, advance to next chapter or key
        advanceLearningPath();
      } else {
        // Ask another triad question
        askNewQuestion();
      }
    } else {
      // For non-triad questions (accCount, accNotes, scale), advance immediately
      advanceLearningPath();
    }
  }
  
  saveLearningState();
  renderNewUI(); 
  attachNewEventListeners();
}

function advanceLearningPath() {
  const group = getCurrentGroup();
  const key = getCurrentKey();
  const chapter = getCurrentChapter();
  
  // Reset correct answers counter for new chapter
  learningState.correctAnswersInChapter = 0;
  // Reset used degrees for new chapter
  learningState.usedDegrees = [];
  
  // Special case: If we just answered "accCount" for a key with 0 accidentals,
  // skip the "accNotes" question and go directly to "scale"
  if (chapter.id === 'accCount' && quizData[key].accidentals === 0) {
    learningState.currentChapterIndex = 2; // Skip to 'scale' (index 2)
  } else {
    learningState.currentChapterIndex++;
  }
  
  if (learningState.currentChapterIndex >= learningPath.chapters.length) {
    // All chapters completed for this key, move to next key
    learningState.currentChapterIndex = 0;
    learningState.currentKeyIndex++;
    
    if (learningState.currentKeyIndex >= group.keys.length) {
      // All keys completed in this group
      learningState.currentKeyIndex = 0;
      learningState.currentGroup++;
      
      if (learningState.currentGroup >= learningPath.groups.length) {
        // Path complete! Move to advanced practice
        learningState.currentGroup = learningPath.groups.findIndex(g => g.name === 'Advanced 1 (All Topics)');
        learningState.mode = 'advanced';
      } else {
        learningState.mode = getCurrentGroup().mode;
      }
    }
  }
  
  askNewQuestion();
  renderNewUI();
}

function startFreePractice() {
  const key = document.getElementById('key-select').value;
  const chapterId = document.getElementById('chapter-select').value;

  learningState.mode = 'free-practice';
  learningState.freePractice = {
    key,
    chapterId,
    isAccidentalsSequence: chapterId === 'accCount'
  };
  renderNewUI();
}

function startAdvancedPractice(mode) {
    learningState.mode = mode;
    const groupName = mode === 'advanced' ? 'Advanced 1 (All Topics)' : 'Advanced 2 (Chord Spelling)';
    learningState.currentGroup = learningPath.groups.findIndex(g => g.name === groupName);
    learningState.currentChapterIndex = 0;
    learningState.correctAnswersInChapter = 0;
    renderNewUI();
}

// Add sevenths back to advanced practice questions
function askAdvancedQuestion() {
  const questionDisplay = document.getElementById('question-display');
  const answerInput = document.getElementById('answer-input');
  const feedback = document.getElementById('feedback');
  
  document.getElementById('answer-form').style.display = 'flex';
  answerInput.value = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  answerInput.focus();

  const group = getCurrentGroup();
  const key = group.keys[Math.floor(Math.random() * group.keys.length)];
  const chapter = learningPath.chapters[Math.floor(Math.random() * learningPath.chapters.length)];
  let text = '';
  
  learningState.currentQuestion = { key, chapterId: chapter.id };

  switch (chapter.id) {
    case 'accCount':
      text = `How many accidentals are in ${key} major?`;
      break;
    case 'accNotes':
      text = `Name the accidentals in ${key} major.`;
      break;
    case 'scale':
      text = `Spell the ${key} major scale.`;
      break;
    case 'triads':
      const degree = Math.floor(Math.random() * 6) + 2;
      learningState.currentQuestion.degree = degree;
      text = `Name the ${ordinal(degree)} triad in ${key} major.`;
      break;
  }
  
  // Add sevenths for advanced practice
  if (learningState.mode === 'advanced' || learningState.mode === 'advanced2') {
    const shouldAskSeventh = Math.random() < 0.3; // 30% chance for seventh question
    if (shouldAskSeventh) {
      const degree = Math.floor(Math.random() * 6) + 2;
      learningState.currentQuestion.degree = degree;
      if (learningState.mode === 'advanced2') {
        text = `Spell the ${ordinal(degree)} seventh chord in ${key} major.`;
        learningState.currentQuestion.chapterId = 'seventhSpelling';
      } else {
        text = `Name the ${ordinal(degree)} seventh chord in ${key} major.`;
        learningState.currentQuestion.chapterId = 'sevenths';
      }
    }
  }
  
  questionDisplay.textContent = text;
}

// --- Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  initLearningState();
  renderNewUI();
}); 