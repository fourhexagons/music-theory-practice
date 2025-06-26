console.log('main.js loaded');

// --- 1. Constants and Data ---
// Data is now loaded from quizData.js and is available on the window object.

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

// Learning state is now managed in learningState.js

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
  return window.learningPath[window.learningState.currentLevelIndex];
}

function advanceQuestionPointer() {
    const level = getCurrentLevel();
    
    if (level.mode === MODES.LINEAR) {
        // For linear mode, advance chapter normally
        window.learningState.currentChapterIndex++;
        
        // If the key is C and we would now ask to NAME the accidentals, skip it.
        const key = level.keys[window.learningState.currentKeyIndex];
        const nextChapter = level.chapters[window.learningState.currentChapterIndex];
        if (key === 'C' && nextChapter && nextChapter.id === window.CHAPTERS.ACCIDENTALS_NAMES.id) {
            window.learningState.currentChapterIndex++; // Skip ahead
        }
        
        if (window.learningState.currentChapterIndex >= level.chapters.length) {
            window.learningState.currentChapterIndex = 0;
            // This should not happen in linear mode as we handle key advancement in handleAnswerSubmit
        }
    } else {
        // For non-linear modes, advance chapter normally
        window.learningState.usedDegrees = []; // Reset for triad questions in next chapter
        window.learningState.currentChapterIndex++;
        
        if (window.learningState.currentChapterIndex >= level.chapters.length) {
            window.learningState.currentChapterIndex = 0;
            // For random modes, a new key is picked on each question automatically.
        }
    }
}

function advanceLevel() {
    window.learningState.currentLevelIndex++;
    window.learningState.currentChapterIndex = 0;
    window.learningState.currentKeyIndex = 0;
    window.learningState.correctAnswerStreak = 0;
}


// --- 4. UI Rendering & Event Handling ---

function renderAppLayout() {
  const appContainer = document.getElementById('app-container');
  appContainer.innerHTML = `
    <header class="app-header">
      <a href="/" class="logo-link">
        <img src="/images/lb-loop-logo-white-on-trans.png" alt="Logo" class="app-logo">
      </a>
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
      if (window.learningState.lastAnswerIncorrect) {
        answerInput.value = '';
        window.learningState.lastAnswerIncorrect = false;
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
      key = level.keys[window.learningState.currentKeyIndex];
  } else { // All other modes use random keys from the level's key list
      key = level.keys[Math.floor(Math.random() * level.keys.length)];
  }
  
  // Determine the chapter for the question
  if (level.mode === MODES.RANDOM_ALL) {
      chapter = level.chapters[Math.floor(Math.random() * level.chapters.length)];
  } else { // Linear and Random_Keys_Linear_Chapters use the linear chapter progression
      chapter = level.chapters[window.learningState.currentChapterIndex];
  }

  window.learningState.currentQuestion = { key, chapterId: chapter.id };
  let text = '';
  let degree;

  switch (chapter.id) {
    case QUESTION_TYPES.ACCIDENTALS_COUNT:
      text = `How many accidentals are in ${key} major?`;
      break;
    case QUESTION_TYPES.ACCIDENTALS_NAMES:
      text = `Name the accidentals in ${key} major.`;
      window.learningState.lastAccidentalsKey = key;
      break;
    case QUESTION_TYPES.SCALE_SPELLING:
      text = `Spell the ${key} major scale.`;
      break;
    case QUESTION_TYPES.TRIADS:
    case QUESTION_TYPES.SEVENTHS:
    case QUESTION_TYPES.SEVENTH_SPELLING:
      const allDegrees = [2, 3, 4, 5, 6, 7];
      let availableDegrees = allDegrees.filter(d => !window.learningState.usedDegrees.includes(d));
      
      if (availableDegrees.length === 0) {
        // All degrees have been used for this key
        // For linear mode, this should not happen as we handle progression in handleAnswerSubmit
        // For non-linear modes, reset and continue
        const level = getCurrentLevel();
        if (level.mode !== MODES.LINEAR) {
          window.learningState.usedDegrees = [];
          availableDegrees = allDegrees;
        }
      }
      
      degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
      window.learningState.currentQuestion.degree = degree;
      
      const chordType = chapter.id === QUESTION_TYPES.TRIADS ? 'triad' : 'seventh chord';
      const action = chapter.id === QUESTION_TYPES.SEVENTH_SPELLING ? 'Spell' : 'Name';
      text = `${action} the ${ordinal(degree)} ${chordType} in ${key} major.`;
      break;
  }
  
  updateQuestionUI(text);
  window.learningState.lastAnswerIncorrect = false;
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
    
    if (window.learningState.isAdvancedMode) {
      // Handle A/B pair logic for accidentals questions
      if (window.learningState.currentQuestion && 
          window.learningState.currentQuestion.chapterId === QUESTION_TYPES.ACCIDENTALS_COUNT &&
          window.quizData[window.learningState.currentQuestion.key].accidentals > 0) {
        // We just answered accidentals count correctly, now ask naming for the same key
        const key = window.learningState.currentQuestion.key;
        window.learningState.currentQuestion = { key: key, chapterId: QUESTION_TYPES.ACCIDENTALS_NAMES };
        const text = `Name the accidentals in ${key} major.`;
        updateQuestionUI(text);
      } else {
        // Normal case - start a new random question
        startAdvancedPractice(window.learningState.advancedModeType);
      }
    } else {
      const level = getCurrentLevel();
      
      if (level.mode === MODES.LINEAR) {
        // For linear mode, handle progression based on question type
        const currentChapter = level.chapters[window.learningState.currentChapterIndex];
        
        if (currentChapter.id === QUESTION_TYPES.TRIADS) {
          // This is a chord question - increment counter
          window.learningState.correctChordAnswersForCurrentKey++;
          
          // Add the degree to usedDegrees to prevent asking the same chord again
          if (window.learningState.currentQuestion && window.learningState.currentQuestion.degree) {
            window.learningState.usedDegrees.push(window.learningState.currentQuestion.degree);
          }
          
          // Check if we've answered 3 chord questions correctly
          if (window.learningState.correctChordAnswersForCurrentKey >= 3) {
            // Reset counter and advance to next key
            window.learningState.correctChordAnswersForCurrentKey = 0;
            window.learningState.usedDegrees = [];
            window.learningState.currentKeyIndex++;
            
            // Check if we've completed all keys in this level
            if (window.learningState.currentKeyIndex >= level.keys.length) {
              advanceLevel();
            } else {
              // Reset to first chapter for the new key
              window.learningState.currentChapterIndex = 0;
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
        window.learningState.correctAnswerStreak++;

        // Check if the streak completes the LEVEL
        if (window.learningState.correctAnswerStreak >= level.requiredStreak) {
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
    window.learningState.correctAnswerStreak = 0; // Reset streak on incorrect answer
    window.learningState.lastAnswerIncorrect = true;
  }
}

function checkAnswer(answer) {
  const q = window.learningState.currentQuestion;
  if (!q) return false;

  const { key, chapterId, degree } = q;
  const data = window.quizData[key];

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
  window.learningState.isAdvancedMode = true;
  window.learningState.advancedModeType = mode;
  window.learningState.correctAnswerStreak = 0;
  window.learningState.usedDegrees = [];
  window.learningState.currentQuestion = null;
  
  if (mode === 'random_all') {
    // For random practice, we'll use a simple approach
    // Pick a random key and random chapter
    let randomKey = Object.keys(window.quizData).filter(k => k !== window.learningState.lastAccidentalsKey);
    let randomChapter;
    
    // Pick a random chapter, but exclude accidentals naming and seventh spelling
    const availableChapters = Object.values(window.CHAPTERS).filter(chapter => 
      chapter.id !== QUESTION_TYPES.ACCIDENTALS_NAMES &&
      chapter.id !== QUESTION_TYPES.SEVENTH_SPELLING
    );
    randomChapter = availableChapters[Math.floor(Math.random() * availableChapters.length)];
    
    window.learningState.currentQuestion = { key: randomKey[Math.floor(Math.random() * randomKey.length)], chapterId: randomChapter.id };
    
    let text = '';
    let degree;

    switch (randomChapter.id) {
      case QUESTION_TYPES.ACCIDENTALS_COUNT:
        text = `How many accidentals are in ${randomKey[Math.floor(Math.random() * randomKey.length)]} major?`;
        break;
      case QUESTION_TYPES.SCALE_SPELLING:
        text = `Spell the ${randomKey[Math.floor(Math.random() * randomKey.length)]} major scale.`;
        break;
      case QUESTION_TYPES.TRIADS:
      case QUESTION_TYPES.SEVENTHS:
        degree = [2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 6)];
        window.learningState.currentQuestion.degree = degree;
        
        const chordType = randomChapter.id === QUESTION_TYPES.TRIADS ? 'triad' : 'seventh chord';
        const action = 'Name';
        text = `${action} the ${ordinal(degree)} ${chordType} in ${randomKey[Math.floor(Math.random() * randomKey.length)]} major.`;
        break;
    }
    
    updateQuestionUI(text);
    
  } else if (mode === 'sevenths_only') {
    // For sevenths practice, focus ONLY on seventh chord spelling
    const randomKey = Object.keys(window.quizData).filter(k => k !== window.learningState.lastAccidentalsKey);
    const randomChapter = window.CHAPTERS.SEVENTH_SPELLING; // Only spelling, not naming
    
    window.learningState.currentQuestion = { key: randomKey[Math.floor(Math.random() * randomKey.length)], chapterId: randomChapter.id };
    
    const degree = [2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 6)];
    window.learningState.currentQuestion.degree = degree;
    
    const chordType = 'seventh chord';
    const action = 'Spell';
    const text = `${action} the ${ordinal(degree)} ${chordType} in ${randomKey[Math.floor(Math.random() * randomKey.length)]} major.`;
    
    updateQuestionUI(text);
  }
}


// --- 7. Initializer ---
function initializeApp() {
    renderAppLayout();
    attachEventListeners();
    if (window.initLearningState) {
        window.initLearningState();
    }
    askQuestion();
}

// Expose functions globally for menu system access
window.askQuestion = askQuestion;
window.startAdvancedPractice = startAdvancedPractice;
window.resetQuiz = function() {
    console.log('resetQuiz called');
    
    if (window.resetLearningState) {
        console.log('Calling resetLearningState');
        window.resetLearningState();
        console.log('resetLearningState completed');
    } else {
        console.error('resetLearningState not available');
    }
    
    if (window.saveLearningState) {
        console.log('Calling saveLearningState');
        window.saveLearningState();
        console.log('saveLearningState completed');
    } else {
        console.error('saveLearningState not available');
    }
    
    // Clear any feedback messages
    const feedback = document.getElementById('feedback');
    if (feedback) {
        console.log('Clearing feedback');
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
    
    // Clear the answer input
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        console.log('Clearing answer input');
        answerInput.value = '';
    }
    
    // Ask a fresh question
    console.log('Calling askQuestion');
    askQuestion();
    console.log('resetQuiz completed');
};

// Kick off the app
initializeApp(); 