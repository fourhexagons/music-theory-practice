/**
 * App Layout Component
 * Handles main application layout rendering
 */
export class AppLayout {
  constructor(containerId = 'app-container') {
    this.container = document.getElementById(containerId);
  }

  renderPracticeLayout() {
    console.log('📐 AppLayout.renderPracticeLayout: Starting layout render');
    console.log('📐 Container element:', this.container);
    
    if (!this.container) {
      console.error('❌ App container not found');
      return;
    }

    console.log('📐 About to set innerHTML with simplified structure');
    this.container.innerHTML = `
      <header class="flex justify-center items-center relative pb-12">
        <a href="/" class="logo-link" aria-label="Return to home">
          <img src="/images/lb-loop-logo-white-on-trans.png" alt="Music Theory Practice Logo" class="app-logo">
        </a>
      </header>
      <main class="flex-1 pt-24">
        <div class="w-full max-w-4xl mx-auto px-3 sm:px-4 block">
          <div class="text-2xl md:text-3xl lg:text-4xl mb-12 text-white font-medium leading-tight text-center" 
               id="question-display" 
               role="region" 
               aria-live="polite" 
               aria-label="Current question"></div>
          <form id="answer-form" role="form" aria-label="Answer submission" class="w-full block flex flex-col sm:flex-row gap-2 mb-6">
            <label for="answer-input" class="sr-only">Your answer</label>
            <input type="text" 
                   id="answer-input" 
                   placeholder="Your answer..." 
                   autocomplete="off"
                   aria-describedby="feedback"
                   aria-label="Enter your answer"
                   class="w-full sm:w-80 md:w-96 lg:w-96 flex-1 min-w-0 bg-gray-300 text-gray-900 border border-transparent rounded-none px-5 py-4 text-lg font-normal font-inherit outline-none placeholder-gray-600 focus:bg-gray-300 focus:border-gray-400">
            <button type="submit" 
                    id="submit-btn" 
                    class="w-full sm:w-40 shrink-0 bg-ds-interactive-primary hover:bg-ds-interactive-primary-hover text-white border border-ds-interactive-primary hover:border-ds-interactive-primary-hover rounded-none px-8 py-4 text-lg font-medium leading-relaxed cursor-pointer transition-all duration-150 ease-in-out text-center outline-none hover:translate-y-px active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-describedby="answer-input">
              Submit
            </button>
          </form>
          <div class="text-xl min-h-5 mt-2 font-normal text-white transition-colors duration-150 ease-in-out block empty:mt-0" 
               id="feedback" 
               role="status" 
               aria-live="polite"
               aria-label="Answer feedback"></div>
        </div>
      </main>
    `;
    
    console.log('✅ AppLayout.renderPracticeLayout: innerHTML set successfully');
    
    // Verify the form was created with correct classes
    const form = document.getElementById('answer-form');
    const input = document.getElementById('answer-input');
    const button = document.getElementById('submit-btn');
    
    if (form) {
      console.log('✅ Form created with classes:', form.className);
    } else {
      console.error('❌ Form not found after innerHTML set');
    }
    
    if (input) {
      console.log('✅ Input created with classes:', input.className);
    } else {
      console.error('❌ Input not found after innerHTML set');
    }
    
    if (button) {
      console.log('✅ Button created with classes:', button.className);
    } else {
      console.error('❌ Button not found after innerHTML set');
    }
  }

  renderLandingLayout() {
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    this.container.innerHTML = `
      <header class="flex justify-center items-center relative pb-12">
        <img src="/images/lb-loop-logo-white-on-trans.png" alt="Music Theory Practice Logo" class="h-20 w-auto z-10">
      </header>
      <main class="flex-1 flex flex-col items-center justify-start pt-24">
        <section class="text-center max-w-2xl" role="main">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-4">Music Theory Practice</h1>
          <p class="text-lg md:text-xl mb-8 leading-relaxed">Master key signatures, scales, triads, and seventh chords through interactive exercises.</p>
          <!-- Ensure the Start Practice button is always present and styled -->
          <a href="/practice" class="bg-ds-interactive-primary hover:bg-ds-interactive-primary-hover text-white border border-ds-interactive-primary hover:border-ds-interactive-primary-hover rounded-none px-14 py-4 text-lg font-medium leading-relaxed cursor-pointer transition-all duration-150 ease-in-out text-decoration-none inline-block text-center min-w-56 outline-none hover:translate-y-px active:translate-y-0.5" role="button">Start Practice</a>
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