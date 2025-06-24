console.log('main.js loaded');

// --- 1. Constants ---
// QUESTION_TYPES and MODES are now part of the learningState module
// and quizData is on the window object.

// --- 2. Utility Functions ---
// All utilities are now in their respective files (helpers.js, normalization.js)

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// --- 3. State Management & Progression ---
// All state management is now handled by functions in learningState.js

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
  
  const advancedRoot = document.getElementById('advanced-practice-root');
  if (advancedRoot) {
    advancedRoot.innerHTML = `
      <div class="advanced-practice">
        <h3>Advanced Practice</h3>
        <div class="practice-controls">
          <button id="advanced-random-btn" class="btn">Random Questions</button>
          <button id="advanced-sevenths-btn" class="btn">Practice Sevenths</button>
        </div>
      </div>
    `;
  }

  attachEventListeners();
}

function attachEventListeners() {
  const form = document.getElementById('answer-form');
  form?.addEventListener('submit', handleAnswerSubmit);

  const answerInput = document.getElementById('answer-input');
  answerInput?.addEventListener('click', () => {
    const state = window.getLearningState();
    if (state.lastAnswerIncorrect) {
      answerInput.value = '';
      window.recordLastAnswerCorrected(); 
    }
  });
  
  const randomBtn = document.getElementById('advanced-random-btn');
  randomBtn?.addEventListener('click', () => startAdvancedPractice('RANDOM_ALL'));
  
  const seventhsBtn = document.getElementById('advanced-sevenths-btn');
  seventhsBtn?.addEventListener('click', () => startAdvancedPractice('SEVENTHS'));
}

function updateQuestionUI(question) {
  const questionDisplay = document.getElementById('question-display');
  const answerInput = document.getElementById('answer-input');
  const feedback = document.getElementById('feedback');

  if (!question) {
      questionDisplay.textContent = 'Congratulations! You have completed all levels.';
      document.getElementById('answer-form').style.display = 'none';
      return;
  }
  
  document.getElementById('answer-form').style.display = 'flex';
  questionDisplay.textContent = question.questionText;
  answerInput.value = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  answerInput.focus();
}


// --- 5. Question and Answer Logic ---

function askQuestion() {
  const question = window.generateQuestion();
  updateQuestionUI(question);
}

function handleAnswerSubmit(e) {
  e.preventDefault();
  const answer = document.getElementById('answer-input').value;
  const feedback = document.getElementById('feedback');
  const state = window.getLearningState();
  const question = state.currentQuestion;

  // Use the global checkAnswer function for validation
  const isCorrect = window.checkAnswer(
    answer,
    question ? question.chapterId : null,
    question ? question.key : null,
    (question && (question.chapterId === 'triads' || question.chapterId === 'sevenths')) ? question.degree : null,
    window.quizData
  );

  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.className = 'feedback correct';
    window.recordCorrectAnswer();
    setTimeout(() => {
        askQuestion();
    }, 500);
  } else {
    feedback.textContent = 'Incorrect. Try again.';
    feedback.className = 'feedback incorrect';
    window.recordIncorrectAnswer();
  }
}

// --- 6. Learning Path Progression ---

function startAdvancedPractice(mode) {
    window.setMode(mode);
    askQuestion();
}


// --- 7. Initializer ---
function initializeApp() {
    renderAppLayout();
    window.resetLearningState();
    window.saveLearningState();
    window.initLearningState();
    console.log('Initial learningState:', window.learningState);
    console.log('Initial group:', window.getCurrentGroup());
    askQuestion();
}

// Kick off the app
initializeApp(); 