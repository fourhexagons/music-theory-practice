/**
 * App Layout Component
 * Handles main application layout rendering
 */
export class AppLayout {
  constructor(containerId = 'app-container') {
    this.container = document.getElementById(containerId);
  }

  renderPracticeLayout() {
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    this.container.innerHTML = `
      <header class="app-header">
        <a href="/" class="logo-link" aria-label="Return to home">
          <img src="/images/lb-loop-logo-white-on-trans.png" alt="Music Theory Practice Logo" class="app-logo">
        </a>
      </header>
      <main class="main-content">
        <section class="quiz-section" role="main" aria-label="Practice questions">
          <div class="question-display" 
               id="question-display" 
               role="region" 
               aria-live="polite" 
               aria-label="Current question"></div>
          <div class="answer-container">
            <form id="answer-form" role="form" aria-label="Answer submission">
              <label for="answer-input" class="sr-only">Your answer</label>
              <input type="text" 
                     id="answer-input" 
                     placeholder="Your answer..." 
                     autocomplete="off"
                     aria-describedby="feedback"
                     aria-label="Enter your answer">
              <button type="submit" 
                      id="submit-btn" 
                      class="btn"
                      aria-describedby="answer-input">
                Submit
              </button>
            </form>
            <div class="feedback" 
                 id="feedback" 
                 role="status" 
                 aria-live="polite"
                 aria-label="Answer feedback"></div>
          </div>
        </section>
      </main>
    `;
  }

  renderLandingLayout() {
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    this.container.innerHTML = `
      <header class="app-header">
        <img src="/images/lb-loop-logo-white-on-trans.png" alt="Music Theory Practice Logo" class="app-logo">
      </header>
      <main class="main-content">
        <section class="landing-section" role="main">
          <h1>Music Theory Practice</h1>
          <p>Master key signatures, scales, triads, and seventh chords through interactive exercises.</p>
          <a href="/practice" class="btn" role="button">Start Practice</a>
        </section>
      </main>
    `;
  }

  showCompletionMessage() {
    const questionDisplay = document.getElementById('question-display');
    const answerForm = document.getElementById('answer-form');
    
    if (questionDisplay) {
      questionDisplay.textContent = 'Congratulations! You have completed all levels.';
    }
    
    if (answerForm) {
      answerForm.style.display = 'none';
    }
  }
} 