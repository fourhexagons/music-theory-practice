/**
 * Answer Form Component
 * Handles answer input, submission, and feedback
 */
export class AnswerForm {
  constructor(formId = 'answer-form') {
    this.form = document.getElementById(formId);
    this.input = document.getElementById('answer-input');
    this.submitBtn = document.getElementById('submit-btn');
    this.feedback = document.getElementById('feedback');
    this.onSubmit = null;
    
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.onSubmit && typeof this.onSubmit === 'function') {
      const answer = this.getAnswer();
      this.onSubmit(answer);
    }
  }

  getAnswer() {
    return this.input ? this.input.value.trim() : '';
  }

  clearAnswer() {
    if (this.input) {
      this.input.value = '';
    }
  }

  focusInput() {
    if (this.input) {
      this.input.focus();
    }
  }

  showFeedback(message, type = 'neutral') {
    if (this.feedback) {
      this.feedback.textContent = message;
      
      // Base Tailwind classes for feedback
      const baseClasses = 'text-xl min-h-5 mt-2 font-normal transition-colors duration-150 ease-in-out block empty:mt-0';
      
      // Type-specific color classes
      let colorClass = 'text-white'; // neutral default
      if (type === 'correct') {
        colorClass = 'text-green-400';
      } else if (type === 'incorrect') {
        colorClass = 'text-red-400 mb-2';
      }
      
      this.feedback.className = `${baseClasses} ${colorClass}`;
      
      // Announce feedback to screen readers
      if (window.accessibilityManager && message) {
        window.accessibilityManager.announce(message);
      }
    }
  }

  clearFeedback() {
    if (this.feedback) {
      this.feedback.textContent = '';
      this.feedback.className = 'text-xl min-h-5 mt-2 font-normal text-white transition-colors duration-150 ease-in-out block empty:mt-0';
    }
  }

  setSubmitHandler(handler) {
    this.onSubmit = handler;
  }
} 