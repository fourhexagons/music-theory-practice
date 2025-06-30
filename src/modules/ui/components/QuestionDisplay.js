/**
 * Question Display Component
 * Handles rendering and updating question text
 */
export class QuestionDisplay {
  constructor(containerId = 'question-display') {
    this.container = document.getElementById(containerId);
    this.currentQuestion = null;
  }

  render(questionText, clearInput = true) {
    if (!this.container) {
      console.error('Question display container not found');
      return;
    }

    this.container.textContent = questionText;
    this.currentQuestion = questionText;

    // Clear answer input if requested
    if (clearInput) {
      const answerInput = document.getElementById('answer-input');
      if (answerInput) {
        answerInput.value = '';
        answerInput.focus();
      }
    }

    // Announce to screen readers
    if (window.accessibilityManager) {
      window.accessibilityManager.announce(`New question: ${questionText}`);
    }
  }

  clear() {
    if (this.container) {
      this.container.textContent = '';
    }
    this.currentQuestion = null;
  }

  getCurrentQuestion() {
    return this.currentQuestion;
  }
} 